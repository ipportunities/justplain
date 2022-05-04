import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import parse from 'html-react-parser';
import { useHistory } from "react-router-dom";
import { setActivePart, setActiveHomework } from "../../../actions/index.js";
import $ from "jquery";
import {appSettings} from "../../../custom/settings";

const HomeworkHeaderMobile = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const intervention = useSelector(state => state.intervention);
  const activeHomework = useSelector(state => state.activeHomework);
  const allAnswers = useSelector(state => state.answersHomework);

  const [progress, setProgress] = useState(0);
  const [showHomeworkMenu, setShowHomeworkMenu] = useState(false);
  const [firstHomework, setFirstHomework] = useState(false);
  const [homeworks, setHomeworks] = useState([]);

  const [kindOfhomework, setKindOfHomework] = useState("homework");

  useEffect(() => {

    let allHomeworks = [];

    if(typeof intervention.settings !== "undefined")
    {

      let this_homework_obj = intervention.settings.homework.filter(function (homework) {
        return homework.id === activeHomework
      });

      if (this_homework_obj.length > 0)
      {
        allHomeworks = intervention.settings.homework
      }

      if (this_homework_obj.length > 0)
      {
        let this_homework_index = allHomeworks.indexOf(this_homework_obj[0]);
        let indexFirst = false;
        let indexLast = allHomeworks.length - 1; ///30-9-2021 fix indien er maar 1 hoofdles is

        //// get eerste les
        for(let i = this_homework_index ; i < (allHomeworks.length - 1) ; i--){
          if(allHomeworks[i].parent_id == 0)
          {
            indexFirst = i;
            break;
          }

        }
        //// get laatste les
        for(let i = this_homework_index ; i < (allHomeworks.length - 1) ; i++) {
          if(allHomeworks[i].parent_id == 0 && i != this_homework_index)
          {
            indexLast = (i - 1);
            break;
          }
        }

        getHomeworks(allHomeworks, indexFirst, indexLast)

      if(this_homework_index != indexFirst)
      {
        setProgress((100 / (indexLast - indexFirst + 1)) * (this_homework_index - indexFirst))
      } else {
        setProgress(0)
      }

      if(firstHomework == false && indexFirst !== false){
        setFirstHomework(allHomeworks[indexFirst])
      }
    }

    }
  }, [intervention, activeHomework]);

  function getHomeworks(allHomeworks, indexFirst, indexLast){
    let tempHomeworks = []
    for(let i = (indexFirst + 1) ; i < (allHomeworks.length - 1) ; i++){
      if(allHomeworks[i].sub_id == 0){
          tempHomeworks.push(allHomeworks[i])
      }

      if(indexLast == i){
        break;
      }
    }

    setHomeworks(tempHomeworks)
  }

  function goToDashboard(){
    dispatch(setActivePart("homeworks"));
    closeHomeworkMenu();
    history.push("/course/" + intervention.id + '/homeworks/');
  }

  function showHomeworkMenuu() {
    setShowHomeworkMenu(true);
    $("body").addClass('homeworkMenuVisible');
  }

  function closeHomeworkMenu(){
    setShowHomeworkMenu(false)
    $("body").removeClass('homeworkMenuVisible')
  }

  const changeActiveHomework = (homework_id, status) => {
    if('active' == status || homeworkFinished(homework_id)){
      dispatch(setActiveHomework(homework_id));

      setTimeout(function(){
        history.push("/course/" + intervention.id + "/" + kindOfhomework + "/" + homework_id);
        closeHomeworkMenu()
      },400)
    }

  }

  const homeworkFinished = (homework_id) => {
    let currentHomeworkAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(homework_id)
    });
    if (typeof currentHomeworkAnswers !== 'undefined' &&  currentHomeworkAnswers.hasOwnProperty('finished') && currentHomeworkAnswers.finished === true)
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
              <td onClick={()=>showHomeworkMenuu()}>
                <span className="title">{parse(props.homework.title)} &nbsp; <i className="fas fa-chevron-down"></i></span>
                <div className="progressBar">
                  <div className="progress" style={{width:progress + "%   "}}></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </header>
      <div className={"homeworkMenu " + (showHomeworkMenu ? '':'hide')}>
        <i className="fas fa-times" onClick={()=>closeHomeworkMenu(false)}></i>
        <div className="homework" onClick={()=>changeActiveHomework(firstHomework.id)}>
          {firstHomework.title}
        </div>
        <div className="items">
          {homeworks.map((homework, index) => (
            <div key={index} className={"item" + (activeHomework == homework.id ? ' active':'') + (homeworkFinished(homework.id) ?' finished':'')} onClick={()=>changeActiveHomework(homework.id, homework.status)}>
              <div className='progress'>
                {homeworkFinished(homework.id) ?
                  <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done_no_background.svg')}/>
                  :
                  <div>
                    {homework.status === 'active' ?
                      <img src={require('../../../images/course/standard/svg/active.svg')}/>
                      :
                      <img src={require('../../../images/course/standard/svg/locked.svg')}/>
                    }
                  </div>
                }
              </div>
              <div className="title">
                {homework.title}
              </div>
            </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default HomeworkHeaderMobile
