import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';
import GetPart from '../../content/front/get_part.js';
import Buttons from './lesson_buttons.js';
import QuestionnaireProgress from './questionnaire_progress.js';
import LessonHeaderMobile from './lesson_header_mobile.js';
import LoadScreen from '../../loadScreen/index.js';
import { getClone } from "../../utils/index.js";
import { setAnswersLessons } from "../../../actions";
import apiCall from "../../api";
import { useHistory } from "react-router-dom";

let saveTimeOut = null;

const Lesson = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const activeLesson = useSelector(state => state.activeLesson);
  const activeSubLesson = useSelector(state => state.activeSubLesson);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);

  const [lesson, setLesson] = useState({
    id: 0,
    title: "",
    settings: {
      parts: []
    },
  });

  //// start or resume???

   useEffect(() => {

    //lesson zoeken
    let newLesson = intervention.settings.selfhelp.lessons.find((lesson) => {
      return parseInt(lesson.id) === parseInt(activeLesson) && parseInt(lesson.sub_id) === parseInt(activeSubLesson)
    });
    if (typeof newLesson !== 'undefined')
    {
      setLesson(newLesson);
    }
  }, [intervention, activeLesson, activeSubLesson]);

  //auto update -> const updateAnswer dispatched allAnswers en daarop wordt onderstaande getriggerd
  useEffect(() => {

    clearTimeout(saveTimeOut);

    saveTimeOut = setTimeout(() => {
      saveLessonAnswers();
    }, 3000);//getest en ook als je binnen deze tijd naar een andere pagina gaat wordt deze uitgestelde functie nog uitgevoerd!

  }, [allAnswers]);

  const saveImmediately = () => {

    //wordt aangeroepen vanuit component Buttons...
    if (saveTimeOut !== null)
    {
      clearTimeout(saveTimeOut);
      saveLessonAnswers();
    }
  }

  const saveLessonAnswers = () => {

    //answers van deze les zoeken in allAnswers
    let answers = allAnswers.answers.find((lesson) => {
      return parseInt(lesson.the_id) === parseInt(activeLesson)
    });

    if (answers !== undefined) //om te voorkomen dat bij initialisatie van component er een leeg object gesaved wordt
    {

      //evt nog include gegevens invoegen:
      /*
      let theLesson = intervention.settings.selfhelp.lessons.find((lesson) => {
        return parseInt(lesson.id) === parseInt(activeLesson)
      })
      */

      /// er kunnen meerdere lessen zijn met hetzelfde id.....
      /// alle opties doorlopen lost dat het save probleem op? lijkt wel.....
      let theLessons = intervention.settings.selfhelp.lessons.filter(function (lesson) {
        return lesson.id === activeLesson
      });

      if(theLessons.length > 0){
        answers.answers.forEach((answer, aIndex) => {
          for(let i = 0 ; i < theLessons.length ; i++){
            theLessons[i].settings.parts.forEach((part, pIndex) => {
              if (part.id === answer.id && part.hasOwnProperty('parentType'))
              {
                answers.answers[aIndex].parentType = part.parentType;
                answers.answers[aIndex].parentId = part.parentId;
                answers.answers[aIndex].include_id = part.include_id;
              }
            })
          }
        })
      }

      /*
      if (typeof theLesson !== 'undefined')
      {
        answers.answers.forEach((answer, aIndex) => {
          theLesson.settings.parts.forEach((part, pIndex) => {
            if (part.id === answer.id && part.hasOwnProperty('parentType'))
            {
              answers.answers[aIndex].parentType = part.parentType;
              answers.answers[aIndex].parentId = part.parentId;
              answers.answers[aIndex].include_id = part.include_id;
            }
          })
        })
      }
      */

      let lesson = {
        id: activeLesson,
        answers
      }

      apiCall({
        action: "save_lesson_answers",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          lesson
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
    let lessonAnswers = allAnswers.answers.find((lesson) => {
      return parseInt(lesson.the_id) === parseInt(activeLesson)
    });
    if (typeof lessonAnswers !== 'undefined')
    {
      let partAnswer = lessonAnswers.answers.find((answer) => {
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

    let lessonKey = -1;
    for (const [index, lesson] of allAnswers.answers.entries()) {
      if (parseInt(lesson.the_id) === parseInt(activeLesson))
      {
        lessonKey = index;
        break;
      }
    }
    if (lessonKey > -1)
    {
      let partKey = -1;
      for (const [index, answer] of allAnswers.answers[lessonKey].answers.entries()) {
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
        newAllAnswers.answers[lessonKey].answers[partKey].answer = part_answer;
      }
      else
      {
        //add answers, vraag was nog niet eerder beantwoord...
        newAllAnswers.answers[lessonKey].answers.push({
          id: part_id,
          answer: part_answer //parentType, parentId en includeId laten we hier even weg...
        });
      }
      dispatch(setAnswersLessons(newAllAnswers.intervention_id, newAllAnswers.answers));
      //deze dispatch triggered useEffect functie hierboven die antwoorde saved.
    }

  }

  return (
    <>
    {allAnswers.intervention_id > 0 ?
      <form onSubmit={(e) => e.preventDefault()}>
        <LessonHeaderMobile lesson={lesson}/>
        <div className="center">
          <table className='titleHolder'>
            <tbody>
              <tr>
                <td>
                  <h1 id="title">{parse(lesson.title)}</h1>
                </td>
                {
                  (lesson.settings.image != '' && typeof lesson.settings.image !== "undefined") ?
                  <td>
                    <div className="illustration" style={{ backgroundImage: "url('"+ lesson.settings.image + "')" }}>

                    </div>
                  </td>
                    : <></>
                }
              </tr>
            </tbody>
          </table>
        </div>
        <QuestionnaireProgress parts={lesson.settings.parts} type="lesson" />
        {
          lesson.settings.parts.map((part, index) => {
            return (
              <div key={index} className="component_holder" id={'cph_'+part.id} >
                <GetPart
                  index={index}
                  part={part}
                  type="lesson"
                  answer={getPartAnswer(part.id)}
                  updateAnswer={updateAnswer}
                  />
            </div>
            )
          })
        }
        <Buttons saveImmediately={saveImmediately} />
      </form>
      : <LoadScreen/>}
    </>
  )

}

export default Lesson;
