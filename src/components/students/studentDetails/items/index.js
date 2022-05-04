import React, { useEffect, useState } from "react";
import Content from "./content.js";
import t from "../../../translate";
import moment from 'moment'

const  StudentDetailsItems = props => {

    const [items, setItems] = useState([]);
    const [answers, setAnswers] = useState([]);
    //setItems(intervention.settings.selfhelp.items);
    const [itemshown, setItemShown] = useState(0);
    let last_id = 0;

    useEffect(() => {
        setItems(props.items)
        setAnswers(props.answers)

        if(props.type == "questionnaire") {
          /// find first questionnaire thats not hidden
          for(let i = 0 ; i < props.items.length ; i++){
            if(isNotHidden(props.items[i].settings))
            {
              setItemShown(i);
              break;
            }
          }
        }
    }, [props])

    const setitem = (e) => {
        e.preventDefault();
        setItemShown(e.target.value);
    }

    /// get first not hidden item
    const isNotHidden = (item) => {
        if(item.visible && item.visible == "hidden"){
          return false
        } else {
          return true
        }
    }

    //
    const checkIfLessonUnseen = (lesson_id) => {
      let lesson = answers.find(a => parseInt(a.the_id) === parseInt(lesson_id));
      if (typeof lesson !== 'undefined')
      {

        if (typeof lesson.unseen !== 'undefined')
        {
          return lesson.unseen;
        }
        return false;
      }
      else
      {
        return false;
      }
    }

    return (
        <div>
          <div className="select-switch-holder">
            <div className="anotherHolder">
              <select className="custom-select" onChange={(e) => setitem(e)} value={parseInt(itemshown)}>
                  {
                      items.map((item, index) => {
                          if ((props.type == "questionnaire" && isNotHidden(item.settings))|| props.type == "goal" || (props.type == "lesson" && item.parent_id == 0) && item.id !== last_id  || (props.type == "homework" && item.parent_id == 0) && item.id !== last_id)
                          {
                              let answer = answers.find(a => parseInt(a.the_id) === parseInt(item.id));
                              last_id = item.id;
                              return (
                                  <option key={index} value={index} className={(checkIfLessonUnseen(item.id)) ? 'text-warning' : ''}>
                                    {item.optional ? t('Optionele les: '):''}
                                    {item.title}
                                    {
                                    ((props.type == "lesson" || props.type == "homework") && typeof answer !== "undefined" && typeof answer.finishedTimestamp !== 'undefined' && answer.finishedTimestamp > 0) ?
                                    ' (' + moment.unix(answer.finishedTimestamp).format("DD-MM-YYYY HH:mm:ss", { trim: false }) + ')'
                                    : ''
                                    }
                                  </option>
                              )
                          }
                      })
                  }
              </select>
            </div>
          </div>
          <br /><br />
          <Content itemKey={itemshown} items={items} answers={answers} type={props.type} studentId={props.studentId} type={props.type} />
        </div>
    )
}

export default StudentDetailsItems;
