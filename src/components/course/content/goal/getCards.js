import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import GetCard from "./custom/card/";
import {getAnswerById} from "../../../helpers/getAnswerById";
import {getTimeStamp} from "../../../helpers/changeFormatDate";
import SortObjectArray from "../../../helpers/sortObjectArray.js";

const GetCards = (props) => {

  const history = useHistory();

  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    ///sort by field datepicker
    ///bij nog een doel dan een wat generieker scriptje toevoegen
    if(props.activeGoal == 24){
      let tempAnswers = []
      for(let i = 0 ; i< props.answers.length ; i++){
        tempAnswers.push(props.answers[i])
        let dateTime = false;
        let answers = false;
        if(props.answers[i].answers.answers){
          answers = props.answers[i].answers.answers
        } else {
          answers = props.answers[i].answers
        }
        if(props.answers[i].goal_id == 24){
          dateTime = getAnswerById("90cafde9-41b6-4fd8-bbbb-add8b5d34220", answers)
        } else {
          dateTime = getAnswerById("473efa0b-0530-4e51-b71a-b3e0e568978f", answers)
        }
        tempAnswers[i].sortByDate = getTimeStamp(dateTime);
      }
      tempAnswers.sort(SortObjectArray("sortByDate", "desc"))
      setAnswers(tempAnswers)
    } else {
      setAnswers(props.answers)
    }

  }, [props]);

  const editGoal = (goal_id, answer_id) => {
    history.push("/course/" + props.intervention_id + "/goal-edit/" + goal_id + "/" + answer_id);
  }

  return (
    <div className="holderItems">
      {answers.map((answer, index) =>
        <GetCard className="pointer" key={index} answer={answer} index={index} activeGoal={props.activeGoal} onClick={() => editGoal(answer.goal_id, answer.id)} />
        )}
    </div>
  )
}

export default GetCards
