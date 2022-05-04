import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LeftBottom from "./leftBottom.js";
import t from "../../translate";
import MenuItems from "./menu_items.js";
import HomeworkMenu from "./homework_menu.js";
import LessonMenu from "./lesson_menu.js";
import LessonMenuTypeSwitcher from "./lesson_menu/index.js";
import { setActivePart, setActiveLesson, setActiveSubLesson } from "../../../actions/index.js";
import {appSettings} from "../../../custom/settings";

let animateTimeout = false;

const DashBoardLeft = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();

  const intervention = useSelector(state => state.intervention);
  const activePart = useSelector(state => state.activePart);
  const auth = useSelector(state => state.auth);
  const activeIntervention = useSelector(state => state.activeIntervention);

  const [animated, setAnimated]= useState(false)

  const [journalTitle, setJournalTitle] = useState('Dagboek')
  const [stressTitle, setStressTitle] = useState('Stemming')
  const [coachTitle, setCoachTitle] = useState('Coach')
  const [interventionTitle, setInterventionTitle] = useState('')

    useEffect(() => {

    if(typeof intervention.settings.menu != "undefined")
    {
      if(intervention.settings.menu.journal != ""){
        setJournalTitle(intervention.settings.menu.journal)
      }
      if(intervention.settings.menu.stress != ""){
        setStressTitle(intervention.settings.menu.stress)
      }
      if(intervention.settings.menu.coach != ""){
        setCoachTitle(intervention.settings.menu.coach)
      }

    }
    ////14-10-2021 set title only if active intervention
    if(activeIntervention == intervention.id){
      setInterventionTitle(intervention.title)
    }

  }, [intervention]);

  useEffect(() => {

    setAnimated(false);

    clearTimeout(animateTimeout);
    animateTimeout = setTimeout(() => {
      setAnimated(true)
    }, 1000)

  }, [activePart]);

  const load = (part) => {
    dispatch(setActiveLesson(0));
    dispatch(setActiveSubLesson(0));
    dispatch(setActivePart(part));
    history.push("/course/" + intervention.id + '/' + part);
  }

  return (
  <div className="left">
    {auth.rights.interventions.length > 1 && (activePart !== 'lesson' && activePart !== 'optional-lesson' && activePart !== 'homework') ?
      <span className="btn btn-primary back" onClick={()=>history.push("/courses/")}>{t("Alle " + appSettings.interventieNameMeervoud.toLowerCase())}</span>
      :''}
    <div className="content">
      {
        (activePart !== 'lesson' && activePart !== 'optional-lesson' && activePart !== 'homework') ?
          <>
            {interventionTitle != '' ?
              <div className="menu">
                <h2 className="title">{interventionTitle}</h2>
                <MenuItems />
              </div>
            :''}
          </>
        :
          <div className="clearfix">
            {appSettings.inLessonMenuType == 2 ?
              '':
              <div>
                <span className="btn back" onClick={()=>load((intervention.settings.intervention_type == "chatcourse" ?'my-homework':'lessons'))}>
                  {t("Terug naar het dashboard")}
                </span>
              </div>
            }
            <div className={"menu" + (appSettings.inLessonMenuType ? " type_" + appSettings.inLessonMenuType:"")}>
              {appSettings.inLessonMenuType ?
                <LessonMenuTypeSwitcher type={appSettings.inLessonMenuType} />
                :
                <>
                  {intervention.settings.intervention_type == "chatcourse" ?
                    <HomeworkMenu />
                  :
                    <LessonMenu />
                  }
                </>
              }
            </div>
            {appSettings.inLessonMenuType == 3 ?
              <div className="quickto">
                {(typeof intervention.settings !== "undefined" && typeof intervention.settings.include_journal !== "undefined" &&  intervention.settings.include_journal === 1) ?
                  <span onClick={()=>load('journal')}>{journalTitle}</span>
                :''}
                {(typeof intervention.settings !== "undefined" && typeof intervention.settings.include_stress_meter !== "undefined" &&  intervention.settings.include_stress_meter === 1) ?
                  <span onClick={()=>load('stress')}>{stressTitle}</span>
                :''}
                {(typeof intervention.settings !== "undefined" && typeof intervention.settings.selfhelp.guided_selfhelp_chat_contact !== "undefined" &&  intervention.settings.selfhelp.guided_selfhelp_chat_contact === 1) ?
                  <span onClick={()=>load('chat')}>{coachTitle}</span>
                :''}

              </div>
              :''
            }
          </div>
        }
      <LeftBottom />
    </div>
  </div>
  );
};

export default DashBoardLeft;
