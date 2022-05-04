import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ConfettiFullScreen from "./confettiFullscreen";
import OptionalLessons from "./optional_lessons.js";
import { setFinishedCourse, setActivePart, setActiveLesson} from "../../../actions";
import Typewriter from 'typewriter-effect';
import t from "../../translate";

const LessonsAltMenu = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersLessons);
  const courseFinished = useSelector(state => state.finishedCourse);

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

  //actieve les bepalen -> les waar nog onafgeronde lessen in zitten
  useEffect(() => {

    let newlessonList = [];
    let unregisteredLesson = {
      id: 0,
      title: '',
      status: 'closed'
    };
    let lastLessonStatus = 'finished';
    let allFinished = true;
    let started = false;
    let someFinished = false;

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
        let alternative_menu_image = '';
        if (typeof lesson.alternative_menu_image !== "undefined")
        {
          alternative_menu_image = lesson.alternative_menu_image;
        }
        unregisteredLesson = {
          id: lesson.id,
          title: lesson.title,
          alternative_menu_image,
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
    newlessonList.push(unregisteredLesson)

    if(allFinished){ /// find last lesson image and set image of that lesson
      for(let i = intervention.settings.selfhelp.lessons.length - 1 ; i >= 0 ; i-- ){
        if(intervention.settings.selfhelp.lessons[i].parent_id == 0){
          setIllustration(typeof intervention.settings.selfhelp.lessons[i].settings.image != 'undefined' ? intervention.settings.selfhelp.lessons[i].settings.image :'')
          break;
        }
      }

    }
    //opschonen -> tbv bug dat niet iedere les altijd op finished wordt gezet en er dan meerdere lessen actief zijn...
    /* let foundactive = false;
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
    */
    setLessonList(newlessonList);

    if(courseFinished){
      setEndCourse('true');
      dispatch(setFinishedCourse(false));
    }

  }, [intervention, allAnswers]);

  const [endCourse, setEndCourse] = useState(false)

  return(
    <div className='lessons'>
      {typeof intervention.settings.subtitle != "undefined" && intervention.settings.subtitle != "" ?
        <div className="title">
          <h1 id="typed_1" className="subTitle"><Typewriter options={{delay:40}}
          onInit={(typewriter) => {
            typewriter.typeString(t(intervention.settings.subtitle))
              .callFunction(() => {
                document.getElementById("typed_1").className = "finished subTitle"
              })
              //.pauseFor(2500)
              //.deleteAll()
              .start();
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

      <div className="lessonsHolder">
        <div className="intro">
          <h2>{typeof intervention.settings.menu != "undefined" ? intervention.settings.menu.modules:''}</h2>
          {typeof intervention.settings.lessonsIntro != 'undefined' &&  intervention.settings.lessonsIntro != '' ? intervention.settings.lessonsIntro:''}
        </div>
        <div className="items_alt">
        {
          //alternatief menu (niet seqentieel, met plaatjes)
          lessonList.map((lesson, index) => {
            return (
            <div key={index} className={'pointer item_alt '+lesson.status} onClick={() => changeActiveLesson(lesson.id, index)}>
              <div className="title">{lesson.title}</div>
              <div className="image" style={{backgroundImage: (typeof lesson.alternative_menu_image !== "undefined" && lesson.alternative_menu_image.length > 0) ? 'url("'+lesson.alternative_menu_image+'")' : ''}}></div>
              <div className={lesson.status !== "closed" ? 'activated' : 'hidden'}>
              
                <div className="vink">
                  <div className="image">
                    <img src={require('../../../images/course/standard/svg/done.svg')}/>
                  </div>
                  <div className="tekst">{t("Aangeschaft")}</div>
                  
                </div>
                
              </div>
            </div>
            )
          })
        }
        </div>
      </div>
      {endCourse  ? <ConfettiFullScreen setEndCourse={setEndCourse}/>:''}
      <OptionalLessons lessonList={lessonList}/>
    </div>
  )
}

export default LessonsAltMenu;
