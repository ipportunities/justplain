import React, {useState, useEffect} from 'react';
import parse from 'html-react-parser';
import { useSelector } from "react-redux";
import t from "../../../translate";
import { stripTags } from "../../../utils";
import {getQuestion} from "./helpers/functions.js";

const Select = (props) => {

  const intervention  = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const activeLesson = useSelector(state => state.activeLesson);

  const [showCorrectAnswers, setShowCorrectAnswers] = useState([])
  const [showCorrectAnswersText, setShowCorrectAnswersText] = useState([])

  function updateSelected(item_id){
    let chosenAnswersUpdated = []
    chosenAnswersUpdated.push(item_id)

    props.updateAnswer(props.part.id, {"chosenAnswers":chosenAnswersUpdated, 'checked':(props.answer.checked ? props.answer.checked:false)})
  }

  function checkIfThereIsCorrectAnswer(){
    let thereIsACorrectAnswer = false;
    for(let i = 0 ; i < props.part.items.length ; i++){
      if(props.part.items[i].correct == 'true'){
        thereIsACorrectAnswer = true;
        break;
      }
    }

    return thereIsACorrectAnswer;
  }

  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if(typeof props.answer != "undefined" && props.answer.checked && props.part.checkable){
      showCorrectAnswer(false)
    } else {
      setShowCorrectAnswers([])
    }
    if(props.part.include_id && props.part.include_id != ""){
      let this_questionnaire_obj = intervention.settings.questionnaires.filter(function (questionnaire) {
        return parseInt(questionnaire.id) === parseInt(props.part.parentId)
      });

      if(this_questionnaire_obj.length > 0){
        ///finish wordt in get_course_answers meegegeven op basis van setting lockAnswersAfterFinishQuestionnaireInLesson
        let this_answer_obj = allAnswers.answers.filter(function (answer) {
          return answer.the_id === activeLesson
        });

        if(this_answer_obj.length > 0){
          if(this_answer_obj[0].locked.includes(props.part.parentId)){
            setDisabled(true);
          }
        }
        ///checked wordt opgeslagen antwoord gecheckt is
        if(props.answer.checked && props.part.checkable){
          setDisabled(true);
        }
      }
    }
  }, [props.part.items, props.answer]);


  function showCorrectAnswer(save = true){
    let tempCorrectAnswer = []
    let tempCorrectAnswerText = []

    for(let i = 0 ; i < props.part.items.length ; i++){
      if(props.part.items[i].correct == 'true'){
        tempCorrectAnswer.push(props.part.items[i].id);
        tempCorrectAnswerText.push(props.part.items[i].content);
      }
    }
    /// en zet dat die een keer gecheckt is
    if(save){
      props.updateAnswer(props.part.id, {"chosenAnswers":props.answer.chosenAnswers, checked:true})
    }

    setShowCorrectAnswers(tempCorrectAnswer)
    setShowCorrectAnswersText(tempCorrectAnswerText)
  }

  return(
    <div className={"list " + (props.part.type == "list" ? props.part.subtype:"") +(props.part.must ? ' must':'')}>
      <div className="content center">
        <div className="question">
          {getQuestion(props.part)}
        </div>
        <select onChange={(e) => updateSelected(e.target.value)} value={typeof props.answer.chosenAnswers != "undefined"? props.answer.chosenAnswers[0]:''} disabled={(props.hasOwnProperty("disabled") && props.disabled === "true") || disabled ? true : false} className={(typeof props.answer.chosenAnswers != "undefined" ?  (showCorrectAnswers.includes(props.answer.chosenAnswers[0]) ? 'correct':''):false)}>
          <option value=''>{t("selecteer een optie")}</option>
          {props.part.items.map((item, index) =>
            <option key={item.id} value={parse(item.id)}>{stripTags(item.content)}</option>
          )}
        </select>
      </div>
      {props.part.checkable && props.answer.checked && checkIfThereIsCorrectAnswer() &&  (( showCorrectAnswers.length > 1 || typeof props.answer.chosenAnswers == "undefined" || !showCorrectAnswers.includes(props.answer.chosenAnswers[0]))) ?
          <div className='correct_answers'>
            <b>{showCorrectAnswersText.length > 1 ? t("De goede antwoorden zijn"):t("Het goede antwoord is")}</b><br/>
            <ul>
            {showCorrectAnswersText.map((answer, index) =>
              <li key={index}>
                {answer}
              </li>
            )}
            </ul>
          </div>
        :false}
      {props.part.checkable && !props.answer.checked && checkIfThereIsCorrectAnswer() ?
        <div className="checkAnswer">
          {showCorrectAnswers.length != 0?
            false
            :
            <span className="btn btn-primary" onClick={()=>showCorrectAnswer()}>
              {t("Check antwoord")}
            </span>
          }

        </div>
        :false}
    </div>
  )
}

export default Select
