import React, {useEffect, useState} from "react";
import StudentDetailsItems from "./items";
import { checkNestedProperties } from "../../utils";
import { useSelector } from "react-redux";
import apiCall from "../../api";

const  StudentDetailsLessons = props => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const [items, setItems] = useState([]);
  const [answers, setAnswers] = useState([]);

  const typesWeNeed = ["matrix", "question_open", "question_checkboxes", "question_radio", "select", "slider", "custom"];

  useEffect(() => {
        
    props.setUnseenLessonMain(props.studentId, false);

    if (checkNestedProperties(intervention, 'settings', 'selfhelp', 'lessons')) 
    {
        let lessons = intervention.settings.selfhelp.lessons;
        //aantekenen welke lessen invul oefeninen bevatten
        lessons.map((item, index) => {
            lessons[index]["hasFillinParts"] = false;
            lessons[index]["optional"] = false;
            lessons[index].settings.parts.map(part => {

                if (typesWeNeed.indexOf(part.type) > -1)
                {
                    lessons[index]["hasFillinParts"] = true;
                }
            })
        })

        let optionalLessons = intervention.settings.selfhelp.optionalLessons;
        //aantekenen welke lessen invul oefeninen bevatten
        optionalLessons.map((item, index) => {
            optionalLessons[index]["hasFillinParts"] = false;
            optionalLessons[index]["optional"] = true;
            optionalLessons[index].settings.parts.map(part => {

                if (typesWeNeed.indexOf(part.type) > -1)
                {
                    optionalLessons[index]["hasFillinParts"] = true;
                }
            })
        })

        setItems(lessons.concat(optionalLessons));

        apiCall({
            action: "get_lesson_answers",
            token: auth.token,
            data: {
                id: lessons[0].id,
                student_id: props.studentId,
            }
            }).then(resp => {
                setAnswers(resp.allAnswers);
            })

    }
  }, [props.studentId])

  return(
    <StudentDetailsItems type="lesson" items={items} answers={answers} studentId={props.studentId} interventionID={intervention.id} />
  )
}

export default StudentDetailsLessons
