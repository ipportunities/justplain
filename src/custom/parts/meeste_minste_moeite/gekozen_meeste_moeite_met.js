import React, { useState, useEffect } from "react";
import t from "../../../components/translate";
import "./style.scss";
import { useSelector } from "react-redux";
import {items} from "./texts.js";

const GekozenMeesteMoeiteMet = props => {

  const allAnswers = useSelector(state => state.answersLessons);
  const [chosen, setChosen] = useState([])
  const [extraTextShown, setExtraTextShown] = useState([])

  //////////////////////
  ///On init get chosen op basis van koppel_id. Deze is meegegeven in het antwoord. Niet heel flexibel maar voor nu denk ik prima.
  useEffect(() => {
    for(let i = 0 ; i < allAnswers.answers.length ; i++){
      for(let ii = 0 ; ii < allAnswers.answers[i].answers.length ; ii++){
        if(allAnswers.answers[i].answers[ii].answer.koppel_id == "c_7"){
          setChosen(allAnswers.answers[i].answers[ii].answer.chosen);
          break;
        }
      }
    }
  }, [allAnswers]);

  const getText = (chosen, extra_text = false) =>{
    let cluster_id = parseInt(chosen.split("_")[0]);
    let item_id = parseInt(chosen.split("_")[1]);

    let this_cluster_texts_obj = items.filter(function (item) {
      return item.id === cluster_id
    });

    if(this_cluster_texts_obj.length > 0){
      let this_cluster_texts_obj_index = items.indexOf(this_cluster_texts_obj[0]);
      let this_text_obj = items[this_cluster_texts_obj_index].texts.filter(function (text) {
        return text.id === item_id
      });
      if(this_text_obj.length > 0){
        if(!extra_text){
          return this_text_obj[0].text;
        } else {
          return this_text_obj[0].text_uitklap;
        }
      }
    }
  }

  ///functie niet meer nodig maar nog maar even laten staan wellicht toch wel weer nodig
  const toggleExtraText = (cluster_id, item_id) =>{
    /*
    let tempExtraTextShown = [...extraTextShown]
    if(tempExtraTextShown.includes(cluster_id+"_"+item_id)){
      tempExtraTextShown.splice(tempExtraTextShown.indexOf(cluster_id+"_"+item_id), 1);
    } else {
      tempExtraTextShown.push(cluster_id+"_"+item_id)
    }
    setExtraTextShown(tempExtraTextShown)
    */
  }

  return(
    <div className="meeste_moeite_met gekozen">
      {chosen.length > 0 ?
        <ul>
          {chosen.map((chosen, index) =>
            <li key={index} className={(extraTextShown.includes(chosen) ? "extraTextShown":"")}>
              <table>
              <tbody>
                <tr>
                  <td>
                    <span className="red"><i className="fas fa-check"></i></span>
                  </td>
                  <td>
                    <div className="text" onClick={()=>toggleExtraText(chosen)}>
                      {t(getText(chosen))}
                    </div>
                    <div className="extra_text">
                      {t("Bijvoorbeeld")}: {t(getText(chosen, "extra_text"))}
                    </div>
                  </td>
                </tr>
              </tbody>
              </table>
            </li>
          )}
        </ul>
        :t("Nog geen items gezet")}
    </div>
  )
}

export default GekozenMeesteMoeiteMet
