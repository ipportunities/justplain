import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';
import { useHistory } from "react-router-dom";
import { setActivePart, setActiveLesson } from "../../../actions/index.js";
import $ from "jquery";
import {appSettings} from "../../../custom/settings";

const LessonHeaderMobile = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const intervention = useSelector(state => state.intervention);
  const activeLesson = useSelector(state => state.activeLesson);
  const allAnswers = useSelector(state => state.answersLessons);

  const [progress, setProgress] = useState(0);
  const [showLessonMenu, setShowLessonMenu] = useState(false);
  const [firstLesson, setFirstLesson] = useState(false);
  const [lessons, setLessons] = useState([]);

  const [kindOflesson, setKindOfLesson] = useState("lesson");

  useEffect(() => {

    let allLessons = [];

    if(typeof intervention.settings !== "undefined")
    {

      let this_lesson_obj = intervention.settings.selfhelp.lessons.filter(function (lesson) {
        return lesson.id === activeLesson
      });

      if (this_lesson_obj.length > 0)
      {
        allLessons = intervention.settings.selfhelp.lessons
      }
      else
      {
        //optionele les?
        this_lesson_obj = intervention.settings.selfhelp.optionalLessons.filter(function (lesson) {
          return parseInt(lesson.id) === parseInt(activeLesson)
        });
        if (this_lesson_obj.length > 0)
        {
          setKindOfLesson("optional-lesson");
          allLessons = intervention.settings.selfhelp.optionalLessons
        }
      }

      if (this_lesson_obj.length > 0)
      {
        let this_lesson_index = allLessons.indexOf(this_lesson_obj[0]);
        let indexFirst = false;
        let indexLast = allLessons.length - 1; ///30-9-2021 fix indien er maar 1 hoofdles is

        //// get eerste les
        for(let i = this_lesson_index ; i < (allLessons.length - 1) ; i--){
          if(allLessons[i].parent_id == 0)
          {
            indexFirst = i;
            break;
          }

        }
        //// get laatste les
        for(let i = this_lesson_index ; i < (allLessons.length - 1) ; i++) {
          if(allLessons[i].parent_id == 0 && i != this_lesson_index)
          {
            indexLast = (i - 1);
            break;
          }
        }

        getLessons(allLessons, indexFirst, indexLast)

      if(this_lesson_index != indexFirst)
      {
        setProgress((100 / (indexLast - indexFirst + 1)) * (this_lesson_index - indexFirst))
      } else {
        setProgress(0)
      }

      if(firstLesson == false && indexFirst !== false){
        setFirstLesson(allLessons[indexFirst])
      }
    }

    }
  }, [intervention, activeLesson]);

  function getLessons(allLessons, indexFirst, indexLast){
    let tempLessons = []
    for(let i = (indexFirst + 1) ; i < (allLessons.length - 1) ; i++){
      if(allLessons[i].sub_id == 0){
          tempLessons.push(allLessons[i])
      }

      if(indexLast == i){
        break;
      }
    }

    setLessons(tempLessons)
  }

  function goToDashboard(){
    dispatch(setActivePart("lessons"));
    closeLessonMenu();
    history.push("/course/" + intervention.id + '/lessons/');
  }

  function showLessonMenuu() {
    setShowLessonMenu(true);
    $("body").addClass('lessonMenuVisible');
  }

  function closeLessonMenu(){
    setShowLessonMenu(false)
    $("body").removeClass('lessonMenuVisible')
  }

  const changeActiveLesson = (lesson_id, status) => {
    if('active' == status || lessonFinished(lesson_id)){
      dispatch(setActiveLesson(lesson_id));

      setTimeout(function(){
        history.push("/course/" + intervention.id + "/" + kindOflesson + "/" + lesson_id);
        closeLessonMenu()
      },400)
    }

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

  return(
    <div>
      <header className="phone">
        <table>
          <tbody>
            <tr>
              <td onClick={() => goToDashboard()}>
                <span><i className="fas fa-chevron-left"></i>
                  <span className="dash">Dash</span>
                </span>
              </td>
              <td onClick={()=>showLessonMenuu()}>
                <span className="title">{parse(props.lesson.title)} &nbsp; <i className="fas fa-chevron-down"></i></span>
                <div className="progressBar">
                  <div className="progress" style={{width:progress + "%   "}}></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </header>
      <div className={"lessonMenu " + (showLessonMenu ? '':'hide')}>
        <i className="fas fa-times" onClick={()=>closeLessonMenu(false)}></i>
        <div className="lesson" onClick={()=>changeActiveLesson(firstLesson.id)}>
          {firstLesson.title}
        </div>
        <div className="items">
          {lessons.map((lesson, index) => (
            <div key={index} className={"item" + (activeLesson == lesson.id ? ' active':'') + (lessonFinished(lesson.id) ?' finished':'')} onClick={()=>changeActiveLesson(lesson.id, lesson.status)}>
              <div className='progress'>
                {lessonFinished(lesson.id) ?
                  <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done_no_background.svg')}/>
                  :
                  <div>
                    {lesson.status === 'active' ?
                      <img src={require('../../../images/course/standard/svg/active.svg')}/>
                      :
                      <img src={require('../../../images/course/standard/svg/locked.svg')}/>
                    }
                  </div>
                }
              </div>
              <div className="title">
                {lesson.title}
              </div>
            </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default LessonHeaderMobile
