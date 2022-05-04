import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import t from "../../translate";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const QuestionnaireProgress = (props) => {

  const intervention = useSelector(state => state.intervention);
  const activeSubLesson = useSelector(state => state.activeSubLesson);
  const activeLesson = useSelector(state => state.activeLesson);
  const allAnswers = useSelector(state => state.answersLessons);

  const [showProgress, setShowProgress] = useState(false)
  const [myScore, setMyscore] = useState(0);
  const [progressSteps, setProgressSteps] = useState(0)
  const [currentProgressSteps, setCurrentProgressSteps] = useState(1)
  const [thisQuestionnaire, setThisQuestionnaire] = useState(false);
  const [maxScore, setMaxScore] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [locked, setLocked] = useState([]);

  useEffect(() => {
    let questionnaire_id = false
    /// eind scherm
    if(typeof props.parts[0] != 'undefined' && props.parts[0].type == "feedback_questionnaire"){
      questionnaire_id = props.parts[0].form_id;
    } else {
      for(let i = 0 ; i < props.parts.length ; i++){
        if(props.parts[i].parentType == "form"){
          questionnaire_id = props.parts[i].parentId;
          break;
        }
      }
    }

    if(questionnaire_id){
      let this_questionnaire_obj = intervention.settings.questionnaires.filter(function (questionnaire) {
        return questionnaire.id === questionnaire_id
      });

      if(this_questionnaire_obj.length > 0){
        setThisQuestionnaire(this_questionnaire_obj[0])

        let tempMax = 0;
        for(let i = 0 ; i < this_questionnaire_obj[0].settings.ranges.length ; i++){
            if(parseInt(this_questionnaire_obj[0].settings.ranges[i].max) > tempMax){
              tempMax = parseInt(this_questionnaire_obj[0].settings.ranges[i].max);
            }
        }
        setMaxScore(tempMax)

        let tempQuestions = [];
        for(let i = 0 ; i < this_questionnaire_obj[0].settings.parts.length ; i++){
          if(this_questionnaire_obj[0].settings.parts[i].type == "question_radio" || this_questionnaire_obj[0].settings.parts[i].type == "question_checkboxes" || this_questionnaire_obj[0].settings.parts[i].type == "select"){
            tempQuestions.push(this_questionnaire_obj[0].settings.parts[i]);
          }
        }
        setQuestions(tempQuestions)
      }
    } else {
      setThisQuestionnaire(false)
    }

    let this_anwer_obj = allAnswers.answers.filter(function (answers) {
      return answers.the_id === activeLesson
    });

    if(this_anwer_obj.length > 0){
      setAnswers(this_anwer_obj[0].answers)
      setLocked(this_anwer_obj[0].locked)
    }

  }, [intervention, props, allAnswers]);

  useEffect(() => {
    if(intervention.id > 0 && thisQuestionnaire){

      let tempSteps = 0;
      let lessons;

      if(props.type == "optional-lesson"){
        lessons = intervention.settings.selfhelp.optionalLessons;
      } else {
        lessons = intervention.settings.selfhelp.lessons;
      }

      for(let i = 0 ; i < lessons.length ; i++){
        if(parseInt(lessons[i].id) == parseInt(activeLesson)){
          for(let ii = 0 ; ii < lessons[i].settings.parts.length ; ii++){
              if(lessons[i].settings.parts[ii].form_id == thisQuestionnaire.id || (lessons[i].settings.parts[ii].parentId == thisQuestionnaire.id && lessons[i].settings.parts[ii].parentType == "form" )){
                tempSteps++
                break;
              }
          }
        }
      }

      /*
      if(thisQuestionnaire && thisQuestionnaire.settings.feedbackQuestionnaireInLesson == 1){
        tempSteps--;
      }
      */
      setProgressSteps(tempSteps)
    } else {
      setProgressSteps(0)
    }

  }, [intervention, activeSubLesson, thisQuestionnaire]);

  useEffect(() => {
    let lessons;

    if(props.type == "optional-lesson"){
      lessons = intervention.settings.selfhelp.optionalLessons;
    } else {
      lessons = intervention.settings.selfhelp.lessons;
    }

    if(thisQuestionnaire && thisQuestionnaire.settings.progressionQuestionnaireInLesson == 1){
      //detect first part with this form_id
      let this_lesson_obj = lessons.filter(function (lesson) {
        return lesson.id === activeLesson
      });

      let firstStep = 0;
      let breakParent = false;
      if(this_lesson_obj.length > 0){
        for(let i = 0 ; i < this_lesson_obj.length ; i++){
          for(let ii = 0 ; ii < this_lesson_obj[i].settings.parts.length ; ii++){
            if(this_lesson_obj[i].settings.parts[ii].parentId == thisQuestionnaire.id){
              firstStep = i;
              breakParent = true;
              break;
            }
          }
          if(breakParent){
            break;
          }
        }
      }

      setCurrentProgressSteps((activeSubLesson + 1) - firstStep)
      setShowProgress(true)
    } else {
      setCurrentProgressSteps(1)
      setShowProgress(false)
    }

 }, [props, thisQuestionnaire]);

 useEffect(() => {
   let tempScore = 0
   ///
   if(answers.length > 0 ){
     for(let i = 0 ; i < answers.length ; i++){
       /// enkel checken als er chosen answers zijn
       if(answers[i].answer.chosenAnswers){
         for(let ii = 0 ; ii < answers[i].answer.chosenAnswers.length ; ii++){
           /// als antwoord gecheckt is
           /// als op feedback pagina
           /// als antwoorden gefixed zijn

           if(answers[i].answer.checked || props.parts[0].type == "feedback_questionnaire" || (typeof locked != "undefined" && locked.includes(answers[i].answer.parentId))){
             let this_question_obj = questions.filter(function (question) {
               return question.id === answers[i].id
             });

             if(this_question_obj.length > 0){
               let this_item_obj = this_question_obj[0].items.filter(function (item) {
                 return item.id === answers[i].answer.chosenAnswers[ii]
               });

               if(this_item_obj.length > 0){
                 if(this_item_obj[0].value > 0){
                   tempScore = tempScore + parseInt(this_item_obj[0].value);
                 }
               }
             }
           }
         }
       }
     }
   }

   setMyscore(tempScore)
 }, [questions, answers]);

  return(
    <>
      {showProgress && typeof props.parts[0] != "undefined" ?
        <div className="progress_questionnaire">
          <div className="holder_top">
            <table>
              <tr>
                <td>
                <span className="title">
                  {thisQuestionnaire.title}
                </span>
                </td>
                <td>
                  {currentProgressSteps <= progressSteps ?
                    <div className="steps">

                      <CircularProgressbar
                      value={props.parts[0].type == "feedback_questionnaire" ? 100 : ((currentProgressSteps/progressSteps) * 100)}
                      text="" strokeWidth='50'
                      styles={buildStyles({
                          strokeLinecap: "butt"
                        })}/>
                      <span className='type'>
                        {t("activiteiten")}
                      </span>
                    </div>
                  :false}
                </td>
                <td>
                  <div className="score">

                    <CircularProgressbar
                    value={(myScore/maxScore) * 100}
                    text="" strokeWidth='50'
                    styles={buildStyles({
                        strokeLinecap: "butt"
                      })}/>
                      <span className='type'>
                        {t("score")}
                      </span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        :false}
    </>
  )
}

export default QuestionnaireProgress;
