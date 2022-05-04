import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import GetPart from '../content/front/get_part.js';
import Buttons from './T0_buttons.js';
import { getClone } from "../utils/index.js";
import { setAnswersLessons, setActiveLesson, setActiveSubLesson } from "../../actions";
import apiCall from "../api";
import { useHistory } from "react-router-dom";

let saveTimeOut = null;

const QuestionnaireT0 = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  //const auth = useSelector(state => state.auth);
  //const props.questionnaire_id = useSelector(state => state.props.questionnaire_id);
  //const activeSubLesson = useSelector(state => state.activeSubLesson);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const questionnaire = useSelector(state => state.questionnaire);
  const activeLesson = useSelector(state => state.activeSubLesson);
  //const [activeSubLesson, setActiveSublesson] = useState(0);
  const activeSubLesson = useSelector(state => state.activeSubLesson);

  const [lesson, setLesson] = useState({
    id: 0,
    settings: {
      parts: []
    }
  })


  useEffect(() => {

    if (questionnaire.lessons.length > 0)
    {
      let newLesson = questionnaire.lessons.find((lesson, index) => {
        return parseInt(lesson.sub_id) === parseInt(activeSubLesson)
      })
      if (typeof newLesson !== 'undefined') {
        setLesson(newLesson);
      }
    }

    dispatch(setActiveLesson(props.questionnaire_id));
  }, [questionnaire, props.questionnaire_id, activeSubLesson]);

  //auto update -> const updateAnswer dispatched allAnswers en daarop wordt onderstaande getriggerd
  useEffect(() => {
    clearTimeout(saveTimeOut);

    saveTimeOut = setTimeout(() => {
      saveQuestionnaireAnswers();
    }, 3000);//getest en ook als je binnen deze tijd naar een andere pagina gaat wordt deze uitgestelde functie nog uitgevoerd!

  }, [allAnswers]);

  const saveImmediately = () => {

    //wordt aangeroepen vanuit component Buttons...
    if (saveTimeOut !== null)
    {
      clearTimeout(saveTimeOut);
      saveQuestionnaireAnswers();
    }

  }

  const saveQuestionnaireAnswers = () => {

    //answers van deze les zoeken in allAnswers
    let answers = allAnswers.answers[0];

    if (answers !== undefined && !(allAnswers.answers[0].hasOwnProperty("finished") && allAnswers.answers[0].finished === true)) //om te voorkomen dat bij initialisatie van component er een leeg object gesaved wordt, of nadat deze al eerder was afgerond...
    {

      let questionnaire = {
        id: props.questionnaire_id,
        answers
      }
      apiCall({
        action: "save_t0_answers",
        data: {
          language_id: props.language_id,
          token: props.token,
          questionnaire_id: props.questionnaire_id,
          questionnaire
        }
      }).then(() => {
        saveTimeOut = null;
      })
    }
    else
    {
      saveTimeOut = null;
    }

  }

  //antwoord ophalen van betreffend part
  const getPartAnswer = (part_id) => {
    let questionnaireAnswers = allAnswers.answers[0];
    if (typeof questionnaireAnswers !== 'undefined')
    {
      let partAnswer = questionnaireAnswers.answers.find((answer) => {
        return answer.id === part_id
      });
      if (typeof partAnswer !== 'undefined')
      {
        return partAnswer.answer;
      }
      else
      {
        return "";
      }
    }
    else
    {
      return "";
    }
  }

  //////////////////////
  ///Update answers
  const updateAnswer = (part_id, part_answer) => {


    //eventuele rode border bij verplicht veld verwijderen
    if (document.getElementById("cph_"+part_id).getElementsByClassName('must').length > 0)
    {
      document.getElementById("cph_"+part_id).getElementsByClassName('must')[0].classList.remove("empty");
    }

    let questionnaireKey = 0;
    /*
    for (const [index, questionnaire] of allAnswers.answers.entries()) {
      if (parseInt(questionnaire.the_id) === parseInt(props.questionnaire_id))
      {
        questionnaireKey = index;
        break;
      }
    }
    */
    //if (questionnaireKey > -1)
    //{
      let partKey = -1;
      for (const [index, answer] of allAnswers.answers[questionnaireKey].answers.entries()) {
        if (answer.id === part_id)
        {
          partKey = index;
          break;
        }
      }
      let newAllAnswers = getClone(allAnswers);
      if (partKey > -1)
      {
        //update anwers
        newAllAnswers.answers[questionnaireKey].answers[partKey].answer = part_answer;
      }
      else
      {
        //add answers, vraag was nog niet eerder beantwoord...
        newAllAnswers.answers[questionnaireKey].answers.push({
          id: part_id,
          answer: part_answer //parentType, parentId en includeId laten we hier even weg...
        });
      }
      dispatch(setAnswersLessons(newAllAnswers.intervention_id, newAllAnswers.answers));
      //deze dispatch triggered useEffect functie hierboven die antwoorde saved.
    //}

  }

  return (
    <form>
      {
        lesson.settings.parts.map((part, index) => {
          if (!part.hasOwnProperty('placeholder'))
          {
            part.placeholder = '...';
          }
          return (
            <div key={index} className="component_holder" id={'cph_'+part.id} >
              <GetPart
                index={index}
                part={part}
                answer={getPartAnswer(part.id)}
                updateAnswer={updateAnswer}
                />
          </div>
          )
        })
      }
      <br /><br />
      <Buttons saveImmediately={saveImmediately} activeSubLesson={activeSubLesson} token={props.token} language_id={props.language_id} showExclusion={props.showExclusion} goToStep={props.goToStep} />
    </form>
  )

}

export default QuestionnaireT0;
