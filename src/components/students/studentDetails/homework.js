import React, {useEffect, useState} from "react";
import StudentDetailsItems from "./items";
import { checkNestedProperties } from "../../utils";
import { useSelector } from "react-redux";
import apiCall from "../../api";

const  Homework = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState([]);

  const typesWeNeed = ["matrix", "question_open", "question_checkboxes", "question_radio", "select", "slider", "custom"];

  useEffect(() => {

    props.setUnseenLessonMain(props.studentId, false);

    if (checkNestedProperties(intervention, 'settings', 'homework')) 
    {
        let homework = intervention.settings.homework;
        //aantekenen welke lessen invul oefeninen bevatten
        homework.map((item, index) => {
            homework[index]["hasFillinParts"] = false;
            homework[index]["optional"] = false;
            homework[index].settings.parts.map(part => {

                if (typesWeNeed.indexOf(part.type) > -1)
                {
                    homework[index]["hasFillinParts"] = true;
                }
            })
        })


        setItems(homework);

        apiCall({
            action: "get_homework_answers",
            token: auth.token,
            data: {
                id: homework[0].id,
                student_id: props.studentId,
            }
            }).then(resp => {
                setAnswers(resp.allAnswers);
            })

    }
  }, [props.studentId])

  return(
    <StudentDetailsItems type="homework" items={items} answers={answers} studentId={props.studentId} interventionID={intervention.id} />
  )
}

export default Homework
