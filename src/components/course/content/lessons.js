import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ConfettiFullScreen from "./confettiFullscreen";
import OptionalLessons from "./optional_lessons.js";
import { setFinishedCourse, setActivePart, setActiveLesson} from "../../../actions";
import Typewriter from 'typewriter-effect';
import t from "../../translate";
import parse from 'html-react-parser';
import ProfileCoachName from "./leftbottom/profile_coach_name.js";
import ContactMoments from "./contact_moments.js";
import LoadScreen from '../../loadScreen/index.js';
import {appSettings} from "../../../custom/settings";

const Lessons = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const activeIntervention = useSelector(state => state.activeIntervention);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const courseFinished = useSelector(state => state.finishedCourse);

  const [intro, setIntro] = useState('');
  const [courseIntro, setCourseIntro] = useState('');
  const [lessonList, setLessonList] = useState([]);
  const [illustration, setIllustration] = useState('');

  const lessonStarted = (lesson_id) => {
    let currentLessonAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(lesson_id)
    });
    if (typeof currentLessonAnswers !== 'undefined' &&  currentLessonAnswers.hasOwnProperty('started') && currentLessonAnswers.started === true)
    {
      return true;
    }
    else
    {
      return false;
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

  const getActiveLessonLink = (lesson_id, index) => {
    if(lessonList[index].status == 'active'){

      let aFinishedLesson = false;
      let anActiveLesson = false;
      for (const lesson of intervention.settings.selfhelp.lessons) {

        if ((lesson.id == lesson_id) || (parseInt(lesson.parent_id) === parseInt(lesson_id) && (!lesson.hasOwnProperty('sub_id') || parseInt(lesson.sub_id) === 0)))
        {
          if (!anActiveLesson && !lessonFinished(lesson.id))
          {
            lesson_id = lesson.id
            break;
          }
        }
      }
      return lesson_id
    } else {
      return lesson_id
    }
  }
  const changeActiveLesson = (lesson_id, index) => {

    /// ga na welke les actief is in de actieve les
    lesson_id = getActiveLessonLink(lesson_id, index)

    dispatch(setActivePart("lesson"));
    dispatch(setActiveLesson(lesson_id));
    history.push("/course/" + intervention.id + "/lesson/" + lesson_id);

  }

  const fakeEmptyFunc = () => {
    //om react tevreden te stellen
  }

  //13=10 zet intro enkel als interventie is actieveinterventie
  useEffect(() => {
    if(activeIntervention == intervention.id){
      if(typeof intervention.settings.lessonsIntro != 'undefined'){
        setIntro(parse(intervention.settings.lessonsIntro))
      }
      if(typeof intervention.settings.courseIntro != 'undefined'){
        setCourseIntro(parse(intervention.settings.courseIntro))
      }
    }
  }, [intervention]);
  //actieve les bepalen -> les waar nog onafgeronde lessen in zitten
  useEffect(() => {

    if(activeIntervention == intervention.id && allAnswers.intervention_id > 0){ /// 13-10-2021 cursus switch eerste nog oude cursus weergegeven dit lost het op maar het geheel is nog wat chaotisch zo

      let newlessonList = [];
      let unregisteredLesson = {
        id: 0,
        title: '',
        status: 'closed'
      };
      let lastLessonStatus = 'finished';
      let allFinished = true;
      let someFinished = false;

      let old_id = 0;
      for (const lesson of intervention.settings.selfhelp.lessons) {
        if (parseInt(lesson.parent_id) === 0 && parseInt(lesson.sub_id) === 0) //les op hoofdniveau
        {

          if (unregisteredLesson.title.length > 0)
          {
            if (allFinished)
            {
              unregisteredLesson.status = 'finished';
            }
            else
            {
              if (someFinished)
              {
                unregisteredLesson.status = 'active';
              }
              else
              {
                unregisteredLesson.status = 'closed';
              }
            }
            if (unregisteredLesson.status === 'closed' && lastLessonStatus === 'finished')
            {
              unregisteredLesson.status = 'active';
            }
            lastLessonStatus = unregisteredLesson.status;
            newlessonList.push(unregisteredLesson);

            if (unregisteredLesson.status === 'active')
            {
              let activeLesson = intervention.settings.selfhelp.lessons.find(lesson => {
                return parseInt(lesson.id) === parseInt(unregisteredLesson.id)
              })
              setIllustration(typeof activeLesson.settings.image != 'undefined' ? activeLesson.settings.image :'')
            }
          }
          unregisteredLesson = {
            id: lesson.id,
            title: lesson.title,
            status: 'closed'
          };
          allFinished = true;
          someFinished = false;
        }

        //bepalen of les is afgerond...
        let lessonAnswers = allAnswers.answers.find((answer) => {
          return parseInt(answer.the_id) === parseInt(lesson.id)
        });
        if (typeof lessonAnswers === 'undefined' || !lessonAnswers.hasOwnProperty('finished') || lessonAnswers.finished === false)
        {
          allFinished = false;
        }
        else
        {
          someFinished = true;
        }
      }

      if (allFinished)
      {
        unregisteredLesson.status = 'finished';
      }
      else
      {
        if (someFinished)
        {
          unregisteredLesson.status = 'active';
        }
        else
        {
          unregisteredLesson.status = 'closed';
        }
      }
      if (unregisteredLesson.status === 'closed' && lastLessonStatus === 'finished')
      {
        unregisteredLesson.status = 'active';
      }
      if(unregisteredLesson.id > 0){ /// 8-10-2021 enkel pushen indien id > 0
          newlessonList.push(unregisteredLesson);
      }

      if(allFinished){ /// find last lesson image and set image of that lesson
        for(let i = intervention.settings.selfhelp.lessons.length - 1 ; i >= 0 ; i-- ){
          if(intervention.settings.selfhelp.lessons[i].parent_id == 0){
            setIllustration(typeof intervention.settings.selfhelp.lessons[i].settings.image != 'undefined' ? intervention.settings.selfhelp.lessons[i].settings.image :'')
            break;
          }
        }

      }
      //opschonen -> tbv bug dat niet iedere les altijd op finished wordt gezet en er dan meerdere lessen actief zijn...
      let foundactive = false;
      for (var i = newlessonList.length -1;i>=0;i--) {
        if (newlessonList[i].status === 'active')
        {
          if (!foundactive)
          {
            foundactive = true;
          }
          else
          {
            newlessonList[i].status = 'finished';
          }
        }
      }

      setLessonList(newlessonList);

      if(courseFinished){
        setEndCourse('true');
        dispatch(setFinishedCourse(false));
      }

    }

  }, [allAnswers]); /// 6-10-2021 [intervention, allAnswers] pas na doorlopen answers showen

  const [endCourse, setEndCourse] = useState(false)

  return(
    <div className='lessons'>
      <div className="intervention">
        {intervention.title}
      </div>
      {typeof intervention.settings.subtitle !== "undefined" && intervention.settings.subtitle !== "" && lessonList.length > 0  ?
        <div className="title">
          <h1 id="typed_1" className="subTitle"><Typewriter options={{
            strings: t(intervention.settings.subtitle),
            autoStart: true,
            loop: false,
            delay:40,
            deleteAll:false
          }}
          onInit={(typewriter) => {
            typewriter
              .callFunction(() => {
                if(document.getElementById("typed_1")){
                  document.getElementById("typed_1").className = "finished subTitle"
                }
              })
          }}
          /></h1>
          <h1 className="dummy">{intervention.settings.subtitle}</h1>
        </div>
      :''}

      {
      illustration.length > 0 ?
        <div className="illustration">
          <img src={illustration} />
        </div>
      :
        ''
      }

      {appSettings.introCourseField && courseIntro != "" && lessonList.length > 0 ?
        <div className="courseIntro">
          {courseIntro}
        </div>
        :<></>}

      <div className="lessonsHolder">
      {/*wachten tot lessen gezet zijn? 13-10-2021*/}
      {lessonList.length > 0 && allAnswers.intervention_id > 0  ?
        <>
        <div className="intro">
          <h2>{typeof intervention.settings.menu != "undefined" ? intervention.settings.menu.modules:''}</h2>
          {intro != '' ?
            <div className="description">
              {intro}
            </div>
          :''}
        </div>
        <div className='items'>
          {
            lessonList.map((lesson, index) => {
              return (
              <div key={index} className={'item '+lesson.status}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                      {(lesson.status === 'finished' ?
                        <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done.svg')}/>
                        :
                        <div>
                          {lesson.status === 'active' ?
                            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/active.svg')}/>
                            :
                            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/locked.svg')}/>
                          }
                        </div>
                      )}
                      </td>
                      <td>
                        <span onClick={(lesson.status === 'finished' || lesson.status === 'active') ? ()=>changeActiveLesson(lesson.id, index) : ()=>fakeEmptyFunc()} >
                          {lesson.title}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>)
            })
          }
        </div>
        </>
        :<LoadScreen/>}


      </div>
      {endCourse  ? <ConfettiFullScreen setEndCourse={setEndCourse}/>:''}
      {/*wachten tot lessen gezet zijn? 13-10-2021*/}
      {lessonList.length > 0 ?
        <OptionalLessons lessonList={lessonList}  downloadPDF={props.downloadPDF}/>
        :''
      }

      {appSettings.showProfileOnDashboard ?
        <ProfileCoachName extraClass="hide_profile_coach_name_on_phone"/>
        :''}
      {intervention.settings.intervention_type === 'guided_selfhelp' && intervention.settings.selfhelp.guided_selfhelp_plan_contact === 1 && appSettings.planContactOption ?
        <ContactMoments/>
        :''}
    </div>
  )
}

export default Lessons;
