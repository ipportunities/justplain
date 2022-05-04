import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveLesson, setActiveSubLesson } from "../../../actions";
import {appSettings} from "../../../custom/settings";

const LessonMenu = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const [mainLesson, setMainLesson] = useState(0);
  const [lessonList, setLessonList] = useState([]);

  const activeLesson = useSelector(state => state.activeLesson);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const activePart = useSelector(state => state.activePart);

  useEffect(() => {
    let lessonsToUse = intervention.settings.selfhelp.lessons

    if(activePart == "optional-lesson"){
      lessonsToUse = intervention.settings.selfhelp.optionalLessons
    }

    //lesson zoeken
    let lesson = lessonsToUse.find((lesson) => {
      return parseInt(lesson.id) === parseInt(activeLesson)
    });
    //mainLesson bepalen (hoogste in de structuur)
    if (typeof lesson !== 'undefined')
    {
      if (parseInt(lesson.parent_id) === 0)
      {
        setMainLesson(activeLesson);
      }
      else
      {
        setMainLesson(parseInt(lesson.parent_id));
      }
    }
  }, [intervention, activeLesson]);

  //menu items samenstellen
  useEffect(() => {

    if (intervention.id !== 0 && allAnswers.answers.length > 0 && mainLesson !== 0)
    {
      let lessonsToUse = intervention.settings.selfhelp.lessons;

      if(activePart == "optional-lesson") {
        lessonsToUse = intervention.settings.selfhelp.optionalLessons;
      }

      let newLessonList = [];
      let aFinishedLesson = false;
      let anActiveLesson = false;
      for (const lesson of lessonsToUse) {

        if ((parseInt(lesson.id) === parseInt(mainLesson) && parseInt(lesson.sub_id) === 0) || (parseInt(lesson.parent_id) === parseInt(mainLesson) && (!lesson.hasOwnProperty('sub_id') || parseInt(lesson.sub_id) === 0)) &&  ( lesson.settings.visible != 'hidden') )
        {
          if (lessonFinished(lesson.id))
          {
            lesson.status = 'finished';
            aFinishedLesson = true;
          }
          else if (aFinishedLesson && !anActiveLesson)
          {
            lesson.status = 'active';
            /// hier redirecten zorgt voor een onnodige reload + je kan niet meer terug naar de eerste pagina van de les => de link van de actieve les wordt nu opgezocht in het dashboard
            //dispatch(setActiveLesson(lesson.id));
            //history.push("/course/" + intervention.id + "/lesson/" + lesson.id);
            anActiveLesson = true;
          }
          else
          {
            lesson.status = 'closed';
          }

          newLessonList.push(lesson);
        }
        else if (parseInt(lesson.parent_id) === parseInt(mainLesson) && parseInt(lesson.sub_id) > 0)
        {
          //actieve lesson zetten voor lessen die uit meerder schermen (sub_id's) bestaan
          if (aFinishedLesson && !anActiveLesson)
          {
            anActiveLesson = true;
          }
        }

      }
      setLessonList(newLessonList);
    }

  }, [intervention, allAnswers, mainLesson])

  const changeActiveLesson = (lesson_id) => {
    dispatch(setActiveLesson(lesson_id));
    dispatch(setActiveSubLesson(0));
    history.push("/course/" + intervention.id + "/" + activePart + "/" + lesson_id);
  }

  const fakeEmptyFunc = () => {
    //om react tevreden te stellen
  }


  const lessonFinished = (lesson_id) => {
    let currentLessonAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(lesson_id)
    });
    if (typeof currentLessonAnswers !== 'undefined' &&  currentLessonAnswers.hasOwnProperty('finished') && currentLessonAnswers.finished === true)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  return (
    <>
      {
        lessonList.map((lesson, index) => {
          if (parseInt(lesson.id) === parseInt(mainLesson))
          {
            return (
              <div className="parent" key={index}>
                <span onClick={()=>changeActiveLesson(lesson.id)}>{lesson.title}</span>
              </div>
            )
          }
          else if (parseInt(lesson.parent_id) === parseInt(mainLesson))
          {
            return (
              <div className={(lessonFinished(lesson.id) || lesson.status == 'active' ?'':'closed ') + (parseInt(activeLesson) === parseInt(lesson.id) ? 'part active' : 'part') } key={index}>
                <span onClick={(lesson.status === 'finished' || lesson.status === 'active') ? ()=>changeActiveLesson(lesson.id) : ()=>fakeEmptyFunc()} >
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          {lesson.title}
                        </td>
                        <td>
                          {(lessonFinished(lesson.id) && activeLesson !== lesson.id ?
                            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done_no_background.svg')}/>
                          :
                            <div>
                              {activeLesson == lesson.id || lesson.status == 'active'  ? '' : <img src={require('../../../images/course/standard/lock.png')}/>}
                            </div>
                        )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </span>
              </div>
            )
          }
        })
      }
    </>
  )
}

export default LessonMenu;
