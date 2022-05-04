import React, { useState, useEffect } from "react";
import t from "../../../components/translate";
import "./style.scss";
import { useSelector } from "react-redux";
import {items} from "./texts.js";

const MeesteMoeiteMet = props => {

  const allAnswers = useSelector(state => state.answersLessons);
  const [chosen, setChosen] = useState([])
  const [extraTextShown, setExtraTextShown] = useState([])

  //////////////////////
  ///On init get chosen op basis van koppel_id. Deze is meegegeven in het antwoord. Niet heel flexibel maar voor nu denk ik prima.
  useEffect(() => {
    for(let i = 0 ; i < allAnswers.answers.length ; i++){
      for(let ii = 0 ; ii < allAnswers.answers[i].answers.length ; i++){
        if(allAnswers.answers[i].answers[ii].answer.koppel_id == "c_4"){
          setChosen(allAnswers.answers[i].answers[ii].answer.items);
          break;
        }
      }
    }
  }, [allAnswers]);

  const getText = (cluster_id, item_id, extra_text = false) =>{
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
  /*
  ///functie niet meer nodig maar nog maar even laten staan wellicht toch wel weer nodig
  const toggleExtraText = (cluster_id, item_id) =>{
    let tempExtraTextShown = [...extraTextShown]
    if(tempExtraTextShown.includes(cluster_id+"_"+item_id)){
      tempExtraTextShown.splice(tempExtraTextShown.indexOf(cluster_id+"_"+item_id), 1);
    } else {
      tempExtraTextShown.push(cluster_id+"_"+item_id)
    }
    setExtraTextShown(tempExtraTextShown)
  }
  */

  return(
    <div className="meeste_moeite_met">
      {chosen.length > 0 ?
        <ul>
          {chosen.map((c, index) =>
            <>
              {c.items.map((item, index) =>
                <>
                  {item.value == "most" ?
                    <>
                      <li className="extraTextShown">
                        <table>
                        <tbody>
                          <tr>
                            <td>
                              <span className="red"><i className="fas fa-check"></i></span>
                            </td>
                            <td>
                              <div className="text">
                                {t(getText(c.id, item.id))}
                              </div>
                              <div className="extra_text">
                                {t("Bijvoorbeeld")}: {t(getText(c.id, item.id, "extra_text"))}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                        </table>
                      </li>
                    </>
                  :false}
                </>
              )}
            </>
          )}
        </ul>
        :t("Nog geen items gezet")}
    </div>
  )
}

export default MeesteMoeiteMet
