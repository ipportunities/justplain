import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../../translate";
import illustration from "../../../images/course/standard/goals.png";
import { setActivePart, setActiveGoal } from "../../../actions";
import parse from 'html-react-parser';
import Typewriter from 'typewriter-effect';
import {appSettings} from "../../../custom/settings";

const Goals = () =>{

  const history = useHistory();
  const dispatch = useDispatch();
  const [imageToUse, setImageToUse] = useState('')
  const [goals, setGoals] = useState([])
  const answersLessons = useSelector(state => state.answersLessons.answers);

  const intervention = useSelector(state=> state.intervention);

  useEffect(() => {
    if(intervention.id > 0){
      if(intervention.id > 0){
        if(typeof intervention.settings.themeId != 'undefined' && intervention.settings.themeId != 1)
        {
          setImageToUse('')
        } else {
          setImageToUse(illustration)
        }
      }

      let tempGoals = []
      for(let i = 0 ; i < intervention.settings.goals.length ; i++){
        //// filter log items
        if(typeof intervention.settings.goals[i].settings.logOff == "undefined" || intervention.settings.goals[i].settings.logOff == ""){
          intervention.settings.goals[i].statusParentLesson = checkIfParentLessonIsFinished(intervention.settings.goals[i].settings.releaseAfterFinished)

          tempGoals.push(intervention.settings.goals[i])
        }

      }
      setGoals(tempGoals)
    }
  }, [intervention, answersLessons]);

  function checkIfParentLessonIsFinished(the_id){
    let answer_obj = answersLessons.filter(function (answersLesson) {
      return answersLesson.the_id === the_id
    });

    if(answer_obj.length > 0){
      return answer_obj[0].finished == true ? 'open':'closed'
    }
  }

  function getLessonTitle(id){
    let lesson_obj = intervention.settings.selfhelp.lessons.filter(function (lesson) {
      return lesson.id === id
    });

    if(lesson_obj.length > 0){
      return lesson_obj[0].title
    }
  }

  const loadGoal = (id, status) => {
    if(status != "closed"){
      dispatch(setActivePart("goal"));
      dispatch(setActiveGoal(id));
      history.push("/course/" + intervention.id + "/goal/" + id);
    }
  }

  return(
    <div className='goals'>
      <table className="top">
        <tbody>
          <tr>
            <td>
            <h1 id="typed_1" className="big"><Typewriter options={{delay:40}}
            onInit={(typewriter) => {
              typewriter.typeString(typeof appSettings.goalsName != "undefined"&& appSettings.goalsName != "" ? t(appSettings.goalsName):t('Jouw activiteiten'))
                .callFunction(() => {
                  document.getElementById("typed_1").className = "finished big"
                })
                //.pauseFor(2500)
                //.deleteAll()
                .start();
            }}
            /></h1>

              <div className="intro">
                {typeof intervention.settings.goalsIntro != 'undefined' &&  intervention.settings.goalsIntro != '' ? parse(intervention.settings.goalsIntro):''}
              </div>
            </td>
            <td>
              <div className="illustration" >
                <img src={imageToUse}/>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className='items clearfix'>
        {goals.map((goal, index) =>
          <div key={index} className={"item " + (index == 0 ? 'active':'') + ' ' + goal.statusParentLesson } onClick={e=>loadGoal(goal.id, goal.statusParentLesson)}>
            <div className="bg"></div>
            <span className="text">
              {goal.title}
            </span>

            {goal.statusParentLesson != "closed" ?
              <div className='btn_holder'>
                <span className='btn btn-primary'>
                  Go
                </span>
              </div>
            :
              <div className="unlock">
                {t("Ontsluit door het afronden van")} {getLessonTitle(goal.settings.releaseAfterFinished)}<br/>
                <img src={require('../../../images/course/standard/svg/locked.svg')}/>
              </div>
            }

          </div>
        )}
      </div>
      </div>
  )
}
/*
<div className='notification'>
  <img src={require('../../../images/course/standard/chevron.png')}/> As you complete the modules, more goals will appear here.
</div>
*/

export default Goals
