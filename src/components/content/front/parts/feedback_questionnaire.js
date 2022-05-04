/// score / feedback scherm voor geincludeerde vragenlijst
/// of het scherm zichtbaar wordt is zetbaar

import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import t from "../../../translate";
import parse from 'html-react-parser';
import apiCall from "../../../api";
import { setAnswersLessons } from "../../../../actions";

const FeedbackQuestionnaire = (props) => {

  const intervention  = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const activeLesson = useSelector(state => state.activeLesson);
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [ranges, setRanges] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [myScore, setMyscore] = useState(0);
  const [myFeedback, setMyFeedback] = useState(false);
  const [myFeedbackImage, setMyFeedbackImage] = useState(false);
  const [thisQuestionnaire, setThisQuestionnaire] = useState(false);

  useEffect(() => {
    ///endQuestionnaire....
    if(thisQuestionnaire && thisQuestionnaire.settings.lockAnswersAfterFinishQuestionnaireInLesson == 1){
      /// hij slaat hem nog elke keer op... dat is misschien wat overdreven....
      ////antwoorden nog voorzien van finished

      //antwoorden lessen ophalen en in redux store plaatsen



      apiCall({
        action: "end_included_questionnaire",
        token: auth.token,
        data: {
          type: props.type,
          included_id: activeLesson,
          form_id: thisQuestionnaire.id,
          //history:pagesHistory,
          //parentId:props.partsToCombine[0]
        }
      }).then(resp => {
        apiCall({
          action: "get_course_answers",
          token: auth.token,
          data: {
            id: intervention.id
          }
        }).then(resp => {
          dispatch(
            setAnswersLessons(
              intervention.id,
              resp.answers
              )
          )
        });
      });
    }
  }, [thisQuestionnaire]);

  useEffect(() => {
    if(myScore >= 0){
      ///get range feedback
      let tempMyFeedback = false;
      let tempMyFeedbackImage = false;

      for(let i = 0 ; i < ranges.length ; i++){

        if(myScore >= ranges[i].min && myScore <= ranges[i].max){
          tempMyFeedback = ranges[i].feedback;
          tempMyFeedbackImage = ranges[i].image;
          break;
        }
      }

      setMyFeedback(tempMyFeedback);
      setMyFeedbackImage(tempMyFeedbackImage);
    }
  }, [myScore, ranges]);

  useEffect(() => {

    let this_questionnaire_obj = intervention.settings.questionnaires.filter(function (questionnaire) {
      return questionnaire.id === props.part.form_id
    });

    if(this_questionnaire_obj.length > 0){
      setThisQuestionnaire(this_questionnaire_obj[0])
      setRanges(this_questionnaire_obj[0].settings.ranges)

      let tempQuestions = [];
      for(let i = 0 ; i < this_questionnaire_obj[0].settings.parts.length ; i++){
        if(this_questionnaire_obj[0].settings.parts[i].type == "question_radio" || this_questionnaire_obj[0].settings.parts[i].type == "question_checkboxes" || this_questionnaire_obj[0].settings.parts[i].type == "select"){
          tempQuestions.push(this_questionnaire_obj[0].settings.parts[i]);
        }
      }
      setQuestions(tempQuestions)
    }

    let this_anwer_obj = allAnswers.answers.filter(function (answers) {
      return answers.the_id === activeLesson
    });

    if(this_anwer_obj.length > 0){
      setAnswers(this_anwer_obj[0].answers)
    }

  }, [props, allAnswers, intervention]);

  useEffect(() => {
    let tempScore = 0

    if(answers.length > 0 && answers.length > 0){
      for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].answer.chosenAnswers){
          for(let ii = 0 ; ii < answers[i].answer.chosenAnswers.length ; ii++){

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

    setMyscore(tempScore)
  }, [questions, answers]);


  return(
    <>
    {myFeedback || myScore ?
      <div className={"feedback_questionnaire" + (thisQuestionnaire.settings.progressionQuestionnaireInLesson == 1 ? ' progress_shown':'')}>
        <div className="my_score">
          {t("Mijn score")} : <span>{myScore}</span>
        </div>
        {myFeedback ?
          <div className="the_feedback">
            {parse(myFeedback)}
            {myFeedbackImage ?
              <div className="ImageHolderRelative">
                <img src={myFeedbackImage}/>
              </div>
            :''}
          </div>
          :false}
      </div>
      :false}

    </>
  )
}

export default FeedbackQuestionnaire;
