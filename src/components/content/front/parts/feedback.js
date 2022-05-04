import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';
import Matrix from "./matrix.js";
import { getClone } from "../../../utils/index.js";
import t from "../../../translate";

const Feedback = (props) => {

  const intervention  = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const activeLesson = useSelector(state => state.activeLesson);

  const [answers, setAnswers] = useState(false);
  const [chosenOptionsText, setChosenOptionsText] = useState([]);
  const [chosenText, setChosenText] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [question, setQuestion] = useState('');
  const [questionObject, setQuestionObject] = useState({});
  const [questionType, setQuestionType] = useState('question_open');
  let this_answer_obj;

  const fakeUpdate = () => {}

  //////////////////////
  ///Get feedback questions
  useEffect(() => {
    setQuestion(props.part.question)

    /// get lesson question
    let this_lesson_obj = false;
    if(props.type == "optional"){
      this_lesson_obj = intervention.settings.selfhelp.optionalLessons.filter(function (lesson) {
        return lesson.id === props.part.refererIdInLesson
      });
    } else {
      ////2022-2-4 included form feedback mogelijk maken //checkable wordt nog niet meegenomen
      ///included form?
      if(props.part.parentType && props.part.parentType == "form"){
        this_lesson_obj = intervention.settings.questionnaires.filter(function (lesson) {
          return lesson.id === props.part.refererIdInLesson
        });
      } else {
        this_lesson_obj = intervention.settings.selfhelp.lessons.filter(function (lesson) {
          return lesson.id === props.part.refererIdInLesson
        });
      }
    }

    /// samenvoegen parts van de les met meerdere pagina's <= lesson ophaal methode splits ze
    let allLessonParts = []
    for(let i = 0 ; i < this_lesson_obj.length ; i++){
      allLessonParts = allLessonParts.concat(this_lesson_obj[i].settings.parts);
    }

    if(allLessonParts.length > 0)
    {
      let this_question_obj = allLessonParts.filter(function (part) {
        return part.id === props.part.refererId
      });

      if(this_question_obj.length != 0){
        setQuestionType(this_question_obj[0].type)
        /// unset question zodat deze niet ook wordt weergegeven
        /// nu ook gecloond omdat die anders vragen bij radio en checkboxes op dezelfde pagian weggooid
        let question_local = getClone(this_question_obj[0]);
        question_local.question = '';

        if(props.part.parentType && props.part.parentType == "form"){
          if(this_lesson_obj[0].settings.checkAnswerQuestionnaireInLesson == true){
            question_local.checkable = true;
          }
        }

        setQuestionObject(question_local)

        /// get answer
        ////2022-2-4 included form feedback mogelijk maken
        let answersOfLesson
        ///included form?
        if(props.part.parentType && props.part.parentType == "form"){
          answersOfLesson = allAnswers.answers.filter(function (answer) {
            return answer.the_id === activeLesson
          });
        } else {
          answersOfLesson = allAnswers.answers.filter(function (answer) {
            return answer.the_id === props.part.refererIdInLesson
          });
        }

        if(answersOfLesson.length != 0)
        {
          this_answer_obj = answersOfLesson[0].answers.filter(function (answer) {
            return answer.id === props.part.refererId
          });

          ///2022-2-17 toon niet als checkable included vragenlijst die nog niet gecheckt is
          ///checkable en correcte antwoorden
          if(this_answer_obj.length != 0)
          {
            let one_correct = false;
            for(let i = 0 ; i < question_local.items.length ; i++){
              if(question_local.items[i].correct == 'true'){
                one_correct = true;
                break;
              }
            }

          
            if(one_correct && !this_answer_obj[0].answer.checked && question_local.checkable && props.part.parentType && props.part.parentType == "form"){
              this_answer_obj = [];
            }
          }

          if(this_answer_obj.length != 0)
          {
            setAnswers(this_answer_obj[0].answer)
            /// gekozen antwoorden array optie zetten
            if(this_question_obj[0].type == "question_open")
            {
              setChosenText(this_answer_obj[0].answer);
            } else {
              /// meerdere opties mogelijk <= zoek ze
              let tempChosenOptionsText = [];

              if(this_question_obj[0].type == "list"){
                if(this_question_obj[0].subtype == "aanvulbare lijst"){
                  tempChosenOptionsText = this_answer_obj[0].answer.customAnswers;
                }
              } else {
                for(let i = 0 ; i < this_question_obj[0].items.length ; i++)
                {
                  if(this_answer_obj[0].answer.chosenAnswers.includes(this_question_obj[0].items[i].id))
                  {
                    tempChosenOptionsText.push(this_question_obj[0].items[i])
                  }
                }
              }

              setChosenOptionsText(tempChosenOptionsText)
            }
          }
        }
      }

    }

    if(props.part.subtype == "feedback"){
      //// zet feedback in array
      let tempFeedback = [];
      for(let i = 0 ; i < props.part.items.length ; i++)
      {
        if(typeof this_answer_obj != "undefined" && this_answer_obj.length > 0){
          if(this_answer_obj[0].answer.chosenAnswers.includes(props.part.items[i].refererId))
          {
            tempFeedback.push(props.part.items[i])
          }
        }
      }

      setFeedback(tempFeedback)
    }

  }, [props, allAnswers]);

  function getChosenText(question, this_answer_obj, this_question_obj_index){
    if(question.type != "question_open")
    {
      let tempChosenOptionsText = [];
      for(let i = 0 ; i < props.parts[this_question_obj_index].items.length ; i++)
      {
        if(this_answer_obj[0].answer.chosenAnswers.includes(props.parts[this_question_obj_index].items[i].id))
        {
          tempChosenOptionsText.push(props.parts[this_question_obj_index].items[i])
        }
      }
      setChosenOptionsText(tempChosenOptionsText)
    } else {
      setChosenOptionsText('haal tekst uit veld op')
    }
  }

  return(
    <>
    {answers != false && (props.part.subtype == "feedback" && feedback.length != 0 ) ?
    <div className='feedback'>
      <div className="center">
        <div>
          {question != false ?
            <h3 className="question">
              {parse(question)}
            </h3>
            :false
          }
          {answers == false ?
            <div>{t("Er zijn nog geen vragen waar je feedback op kan geven")}</div>
          :
            <div>
              {props.part.subtype == "feedback" ?
                <div className={"feedbackOptions" + (feedback.length == 0 ? ' empty':'')}>
                  {feedback.map((feedbackItem, index) =>
                    <div key={index}>
                      {question.subtype == "radio" ?
                      <div>
                      {(typeof chosenOptionsText[index].correct != "undefined" && chosenOptionsText[index].correct ?
                        <div>
                          {t("Goed zo")}
                        </div>
                        :
                        <div>
                          {t("fout")}
                        </div>)}
                      </div>
                      : ''}
                      {parse(feedbackItem.content)}
                    </div>
                  )}
                </div>
              :
              ''}
              {props.part.subtype == "herhaal antwoord" && questionType != "question_open"  ?
                <>
                  {questionType == "matrix" ?
                    <Matrix index={props.part.id} part={questionObject} updateAnswer={fakeUpdate} answer={answers} disabled="true"/>
                    :
                    <div className="repeat_holder">
                      <ul className={"repeat " + questionType}>
                      {chosenOptionsText.map((chosenOption, index) =>
                        <li key={index}>
                          {parse(chosenOption.content)}
                        </li>
                      )}
                      </ul>
                    </div>
                  }
                </>
              :
                <div>
                {parse(chosenText)}
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
    :
    <div className='feedback empty'></div>
    }
    </>
  )
}

export default Feedback;
