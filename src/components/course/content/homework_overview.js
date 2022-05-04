import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ConfettiFullScreen from "./confettiFullscreen";
import { setFinishedCourse, setActivePart, setActiveHomework} from "../../../actions";
import Typewriter from 'typewriter-effect';
import t from "../../translate";
import parse from 'html-react-parser';
import GroupchatAgenda from "./groupchat_agenda.js";
import ProfileCoachName from "./leftbottom/profile_coach_name.js";
import Groupchat from "./groupchat"; ///groupchat
import {appSettings} from "../../../custom/settings";

const Homework = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const activeIntervention = useSelector(state => state.activeIntervention);
  const intervention = useSelector(state => state.intervention);
  const allAnswers = useSelector(state => state.answersHomework);
  const courseFinished = useSelector(state => state.finishedCourse);

  const [intro, setIntro] = useState('');
  const [homeworkList, setHomeworkList] = useState([]);
  const [illustration, setIllustration] = useState('');

  const homeworkStarted = (homework_id) => {
    let currentHomeworkAnswers = allAnswers.answers.find((answer) => {
      return parseInt(answer.the_id) === parseInt(homework_id)
    });
    if (typeof currentHomeworkAnswers !== 'undefined' &&  currentHomeworkAnswers.hasOwnProperty('started') && currentHomeworkAnswers.started === true)
    {
      return true;
    }
    else
    {
      return false;
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

  const getActiveHomeworkLink = (homework_id, index) => {
    if(homeworkList[index].status == 'active'){

      let aFinishedHomework = false;
      let anActiveHomework = false;
      for (const homework of intervention.settings.homework) {

        if ((homework.id == homework_id) || (parseInt(homework.parent_id) === parseInt(homework_id) && (!homework.hasOwnProperty('sub_id') || parseInt(homework.sub_id) === 0)))
        {
          if (!anActiveHomework && !homeworkFinished(homework.id))
          {
            homework_id = homework.id
            break;
          }
        }
      }
      return homework_id
    } else {
      return homework_id
    }
  }
  const changeActiveHomework = (homework_id, index) => {

    /// ga na welke les actief is in de actieve les
    homework_id = getActiveHomeworkLink(homework_id, index)
    dispatch(setActivePart("homework"));
    dispatch(setActiveHomework(homework_id));
    history.push("/course/" + intervention.id + "/homework/" + homework_id);

  }

  const fakeEmptyFunc = () => {
    //om react tevreden te stellen
  }


  //13=10 zet intro enkel als interventie is actieveinterventie
  useEffect(() => {
    if(activeIntervention == intervention.id){
      if(typeof intervention.settings.homeworkIntro != 'undefined'){
        setIntro(parse(intervention.settings.homeworkIntro))
      }
    }

  }, [intervention]);
  //actieve les bepalen -> les waar nog onafgeronde lessen in zitten
  useEffect(() => {

    if(activeIntervention == intervention.id){ /// 13-10-2021 cursus switch eerste nog oude cursus weergegeven dit lost het op maar het geheel is nog wat chaotisch zo

      let newhomeworkList = [];
      let unregisteredHomework = {
        id: 0,
        title: '',
        status: 'closed'
      };
      let lastHomeworkStatus = 'finished';
      let allFinished = true;
      let someFinished = false;

      let old_id = 0;
      for (const homework of intervention.settings.homework) {
        if (parseInt(homework.parent_id) === 0 && parseInt(homework.sub_id) === 0) //les op hoofdniveau
        {


          if (unregisteredHomework.title.length > 0)
          {
            if (allFinished)
            {
              unregisteredHomework.status = 'finished';
            }
            else
            {
              if (someFinished)
              {
                unregisteredHomework.status = 'active';
              }
              else
              {
                unregisteredHomework.status = 'closed';
              }
            }
            if (unregisteredHomework.status === 'closed' && lastHomeworkStatus === 'finished')
            {
              unregisteredHomework.status = 'active';
            }
            lastHomeworkStatus = unregisteredHomework.status;
            newhomeworkList.push(unregisteredHomework);

            if (unregisteredHomework.status === 'active')
            {
              let activeHomework = intervention.settings.homework.find(homework => {
                return parseInt(homework.id) === parseInt(unregisteredHomework.id)
              })
              setIllustration(typeof activeHomework.settings.image != 'undefined' ? activeHomework.settings.image :'')
            }
          }
          unregisteredHomework = {
            id: homework.id,
            title: homework.title,
            status: 'closed'
          };
          allFinished = true;
          someFinished = false;
        }

        //bepalen of les is afgerond...
        let homeworkAnswers = allAnswers.answers.find((answer) => {
          return parseInt(answer.the_id) === parseInt(homework.id)
        });
        if (typeof homeworkAnswers === 'undefined' || !homeworkAnswers.hasOwnProperty('finished') || homeworkAnswers.finished === false)
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
        unregisteredHomework.status = 'finished';
      }
      else
      {
        if (someFinished)
        {
          unregisteredHomework.status = 'active';
        }
        else
        {
          unregisteredHomework.status = 'closed';
        }
      }
      if (unregisteredHomework.status === 'closed' && lastHomeworkStatus === 'finished')
      {
        unregisteredHomework.status = 'active';
      }
      if(unregisteredHomework.id > 0){ /// 8-10-2021 enkel pushen indien id > 0
          newhomeworkList.push(unregisteredHomework);
      }

      if(allFinished){ /// find last homework image and set image of that homework
        for(let i = intervention.settings.homework.length - 1 ; i >= 0 ; i-- ){
          if(intervention.settings.homework[i].parent_id == 0){
            setIllustration(typeof intervention.settings.homework[i].settings.image != 'undefined' ? intervention.settings.homework[i].settings.image :'')
            break;
          }
        }

      }
      //opschonen -> tbv bug dat niet iedere les altijd op finished wordt gezet en er dan meerdere lessen actief zijn...
      let foundactive = false;
      for (var i = newhomeworkList.length -1;i>=0;i--) {
        if (newhomeworkList[i].status === 'active')
        {
          if (!foundactive)
          {
            foundactive = true;
          }
          else
          {
            newhomeworkList[i].status = 'finished';
          }
        }
      }
      setHomeworkList(newhomeworkList);

      if(courseFinished){
        setEndCourse('true');
        dispatch(setFinishedCourse(false));
      }

    }

  }, [allAnswers]); /// 6-10-2021 [intervention, allAnswers] pas na doorlopen answers showen

  const [endCourse, setEndCourse] = useState(false)

  return(
    <div className='homework'>
      {typeof intervention.settings.subtitle !== "undefined" && intervention.settings.subtitle !== "" && homeworkList.length > 0  ?
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

      <Groupchat setChatActive={props.setChatActive} chatActive={props.chatActive}/>

      <div className="homeworkHolder">
      {/*wachten tot lessen gezet zijn? 13-10-2021*/}
      {homeworkList.length > 0 ?
        <div className="intro">
          <h2>{typeof intervention.settings.menu != "undefined" ? intervention.settings.menu.modules:''}</h2>
          {intro != '' ?
            <div className="description">
              {intro}
            </div>
          :''}
        </div>
        :''}

        <div className='items'>
          {
            homeworkList.map((homework, index) => {
              return (
              <div key={index} className={'item '+homework.status}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                      {(homework.status === 'finished' ?
                        <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/done.svg')}/>
                        :
                        <div>
                          {homework.status === 'active' ?
                            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/active.svg')}/>
                            :
                            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/locked.svg')}/>
                          }
                        </div>
                      )}
                      </td>
                      <td>
                        <span onClick={(homework.status === 'finished' || homework.status === 'active') ? ()=>changeActiveHomework(homework.id, index) : ()=>fakeEmptyFunc()} >
                          {homework.title}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>)
            })
          }
        </div>
      </div>
      {endCourse  ? <ConfettiFullScreen setEndCourse={setEndCourse}/>:''}

      <GroupchatAgenda />

      {appSettings.showProfileOnDashboard ?
        <ProfileCoachName extraClass="hide_profile_coach_name_on_phone"/>
        :''}
    </div>
  )
}

export default Homework;
