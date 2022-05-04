import React, {useEffect, useState} from "react";
import StudentDetailsItems from "./items";
import { checkNestedProperties } from "../../utils";
import { useSelector } from "react-redux";
import apiCall from "../../api";

const  StudentDetailsGoals = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState([]);

  const typesWeNeed = ["matrix", "question_open", "question_checkboxes", "question_radio", "select", "slider", "custom"];

  useEffect(() => {
      if (checkNestedProperties(intervention, 'settings', 'goals')) 
      {
          let goals = intervention.settings.goals;
          //aantekenen welke lessen invul oefeninen bevatten
          goals.map((item, index) => {
              goals[index]["hasFillinParts"] = false;
              goals[index].settings.parts.map(part => {

                  if (typesWeNeed.indexOf(part.type) > -1)
                  {
                      goals[index]["hasFillinParts"] = true;
                  }
              })
          })
          setItems(goals);

          apiCall({
              action: "get_all_goal_answers",
              token: auth.token,
              data: {
                  goal_id: goals[0].id,
                  student_id: props.studentId,
                  //logOff: false,
              }
              }).then(resp => {
                setAnswers(resp.allAnswers);
              })

      }
  }, [props.studentId])

  return(
    <StudentDetailsItems type="goal" items={items} answers={answers}/>
  )
}

export default StudentDetailsGoals
