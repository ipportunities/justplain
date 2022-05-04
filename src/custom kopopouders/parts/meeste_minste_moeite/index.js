import React, { useState, useEffect, useCallback } from "react";
import t from "../../../components/translate";
import "./style.scss";
import {clusters, items} from "./texts.js";
import NotificationBox from "../../../components/alert/notification";

const MeesteMinsteMoeite = props => {

  const [chosen, setChosen] = useState([])
  const [notificationOptions, setNotificationOptions] = useState('');
  const [eventHandlerSet, setEventHandlerSet] = useState(false);

  //////////////////////
  ///On init
  useEffect(() => {
    if(props.answer && Array.isArray(props.answer.items)){
      setChosen(props.answer.items)
      handleNextButton(props.answer.items)
    } else {
      handleNextButton([])
    }
  }, []);

  ///hiermee wordt de next button afgevang het lijkt te werken....
  useEffect(() => {
    var next_button = document.getElementsByClassName("next");

    if(next_button.length > 0){
      if(eventHandlerSet){
        next_button[0].addEventListener('click', showNotification, true)
      } else {
        next_button[0].removeEventListener("click", showNotification, true)
      }
    }

    return () => next_button[0].removeEventListener("click", showNotification, true)
  }, [eventHandlerSet]);

  const choose = (id_cluster, id_item, val) => {
    let tempChosen = [...chosen]

    let this_cluster_obj = tempChosen.filter(function (cluster) {
      return cluster.id === id_cluster
    });

    if(this_cluster_obj.length > 0){
      let this_cluster_obj_index = tempChosen.indexOf(this_cluster_obj[0]);
      let this_item_obj = tempChosen[this_cluster_obj_index].items.filter(function (item) {
        return item.id === id_item
      });

      let this_item_obj_index = tempChosen[this_cluster_obj_index].items.indexOf(this_item_obj[0]);

      if(this_item_obj_index !== -1){
        tempChosen[this_cluster_obj_index].items[this_item_obj_index].value = val
      } else {
        tempChosen[this_cluster_obj_index].items.push({id:id_item, value:val})
      }
    } else {
      tempChosen.push({id:id_cluster, items:[{id:id_item,value:val}]})
    }

    setChosen(tempChosen)
    handleNextButton(tempChosen)
    props.updateAnswer(props.part.id, {koppel_id:"c_4", items:tempChosen})
  }

  ////2022-3-21
  //// wellicht wat complex... maar ik wil wil niet in de core komen
  const handleNextButton = (tempChosen) => {
    var next_button = document.getElementsByClassName("next");
    var prev_button = document.getElementsByClassName("prev");

    let noReds = true;
    for(let i = 0 ; i < tempChosen.length ; i++){
      for(let ii = 0 ; ii < tempChosen[i].items.length ; ii++){
        if(tempChosen[i].items[ii].value == "most"){
          noReds = false;
          break;
        }
        if(!noReds){
          break;
        }
      }
    }
    if(noReds){
      if(!eventHandlerSet){
        setEventHandlerSet(true)
      }
    } else {
      setEventHandlerSet(false)
    }

    if(prev_button.length > 0){
      prev_button[0].addEventListener('click', function(e){
        next_button[0].removeEventListener("click", showNotification, true)
      }, false)
    }
  }

  const showNotification = useCallback((e) => {
    setNotificationOptions({
      show: "true",
      text: t("Vink minstens 1 rood bolletje aan."),
      confirmText: t("Ok")
    });
    e.stopPropagation()
  });

  const checkValue = (id_cluster, id_item, val) => {
    let tempChosen = [...chosen]

    let this_cluster_obj = tempChosen.filter(function (cluster) {
      return cluster.id === id_cluster
    });

    if(this_cluster_obj.length > 0){
      let this_cluster_obj_index = tempChosen.indexOf(this_cluster_obj[0]);
      let this_item_obj = tempChosen[this_cluster_obj_index].items.filter(function (item) {
        return item.id === id_item
      });

      let this_item_obj_index = tempChosen[this_cluster_obj_index].items.indexOf(this_item_obj[0]);

      if(this_item_obj_index !== -1){
        if(tempChosen[this_cluster_obj_index].items[this_item_obj_index].value == val){
          return <i className="fas fa-check"></i>;
        }
      }
    }
  }

  return(
    <div className="meeste_minste_moeite">
      {clusters.map((cluster, index) =>
        <div className="cluster">
          <div className="question">
            {t(cluster.text)}
          </div>
          <ul>
            {items[index].texts.map((item, index_item) =>
              <li>
                <table>
                <tbody>
                  <tr>
                    <td>
                      <span className="green" onClick={()=>choose(cluster.id, item.id, 'least')}>{checkValue(cluster.id, item.id, 'least')}</span>
                      <span className="red" onClick={()=>choose(cluster.id, item.id, 'most')}>{checkValue(cluster.id, item.id, 'most')}</span>
                    </td>
                    <td>
                      {t(item.text)}
                    </td>
                  </tr>
                </tbody>
                </table>
              </li>
            )}
          </ul>
        </div>
      )}
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )
}

export default MeesteMinsteMoeite;
