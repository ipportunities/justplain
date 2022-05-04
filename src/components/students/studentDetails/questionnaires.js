import React, {useEffect, useState} from "react";
//import StudentDetailsItems from "./items";
import Content from "./items/content.js";
import { checkNestedProperties } from "../../utils";
import { useSelector } from "react-redux";
import apiCall from "../../api";

const  StudentDetailsQuestionnaires = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [itemshown, setItemShown] = useState(0);

  const typesWeNeed = ["matrix", "question_open", "question_checkboxes", "question_radio", "select", "slider", "custom"];

  useEffect(() => {
      if (checkNestedProperties(intervention, 'settings', 'questionnaires')) 
      {
          let questionnaires = intervention.settings.questionnaires;
          //aantekenen welke lessen invul oefeninen bevatten
          questionnaires.map((item, index) => {
              questionnaires[index]["hasFillinParts"] = false;
              questionnaires[index]["fillInOnce"] = true;
              questionnaires[index].settings.parts.map(part => {

                  if (typesWeNeed.indexOf(part.type) > -1)
                  {
                      questionnaires[index]["hasFillinParts"] = true;
                  }
              })
          })

          //setItems(questionnaires);
          apiCall({
              action: "get_all_questionnaire_answers",
              token: auth.token,
              data: {
                  id: questionnaires[0].id,
                  student_id: props.studentId,
              }
              }).then(resp => {
         
                setAnswers(resp.allAnswers);

                let questionnaires_filtered = [];
                resp.allAnswers.map(a => {
                    let q = questionnaires.map(qs => {
                        if (parseInt(qs.id) === parseInt(a.the_id))
                        {
                            questionnaires_filtered.push(qs);
                        }
                    })
                })
                setItems(questionnaires_filtered);
              })

      }
  }, [props.studentId])

  const setitem = (e) => {
    e.preventDefault();
    setItemShown(e.target.value);
    }

  return(
    <div>
        <div className="select-switch-holder">
        <div className="anotherHolder">
            <select className="custom-select" onChange={(e) => setitem(e)} value={parseInt(itemshown)}>
                {
                    answers.map((item, index) => {
 
                            return (
                                <option key={index} value={index}>
                                    {item.questionnaire_title} {item.ended}
                                </option>
                            )
                    })
                }
            </select>
        </div>
        </div>
        <br /><br />
        <Content itemKey={itemshown} items={items} answers={answers} type="questionnaire" />
    </div>
  )
}

export default StudentDetailsQuestionnaires
