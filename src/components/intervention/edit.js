import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom' //laten staan ivm nav in leftmenu...
import LeftMenu from '../leftmenu'
import NavBar from './settingparts/navbar.js'
import Intro from './settingparts/intro.js'
import InterventionSettingsLanguage from './settingparts/settings_language.js'
import InterventionSettingsTranslations from '../translations/translations.js'
import InterventionSettingsTitle from './settingparts/title.js'
import InterventionSettingsSubTitle from './settingparts/subtitle.js'
import InterventionSettingsApply from './settingparts/apply.js'
import InterventionSettingsType from './settingparts/type.js'
import InterventionSettingsCoach from './settingparts/coach.js'
import InterventionSettingsCourseIntro from './settingparts/courseintro.js'
import InterventionSettingsJournal from './settingparts/journal.js'
import InterventionSettingsStress from './settingparts/stress.js'
import InterventionSettingsLessons from './settingparts/lessons.js'
import InterventionSettingsChatlesson from './settingparts/chatlessons.js'
import InterventionSettingsHomework from './settingparts/homework.js'
import InterventionSettingsOptionalLessons from './settingparts/optional_lessons.js'
import InterventionSettingsGoals from './settingparts/goals.js'
import InterventionSettingsPages from './settingparts/pages.js'
import InterventionSettingsQuestionnaires from './settingparts/questionnaires.js'
import InterventionSettingsGamification from './settingparts/gamification.js'
import InterventionSettingsJson from './settingparts/json.js'
import InterventionTheme from './settingparts/thema.js'
import apiCall from '../api'
import t from '../translate'
import { setIntervention, setSavingStatus } from '../../actions'
import Saved from "./saved";
import { InterventionSettingsExamType } from './settingparts/examType'
import {appSettings} from "../../custom/settings";

let saveSettingsTimeout = null

const InterventionEdit = () => {

  let location = useLocation()
  const dispatch = useDispatch()

  const settingsType = location.pathname.split('/')[4]

  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeTab, setActiveTab] = useState('general')

  if (settingsType !== activeTab && typeof settingsType != 'undefined' && settingsType !== '') {
    setActiveTab(settingsType)
  }

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const getSettings = intervention_id => {
    //api aanroepen
    apiCall({
      action: "get_intervention_settings",
      token: auth.token,
      data: {
        intervention_id
      }
    }).then(resp => {
      //om bestaande interventies te voorzien van pages...
      if (!resp.settings.hasOwnProperty("pages"))
      {
        resp.settings.pages = [];
      }
      //set settings in global state:
      dispatch(
        setIntervention(
          resp.intervention_id,
          resp.organisation_id,
          resp.title,
          resp.settings
        )
      );
    });
  };

  useEffect(() => {
    if (intervention.id == 0 || intervention.id != location.pathname.split("/")[3]) {
      let intervention_id = location.pathname.split("/")[3];
      getSettings(intervention_id);
    }
    setActiveTab("general");
  }, []);



  const cleanSettings = settings => {
    //het intervention object wordt misbruikt in de app om allerlei data aan te hangen
    //die voor het saven in de DB niet relevant is. Daarom hier een cleanup
    if (settings.hasOwnProperty("goals")) {
      for (var key in settings.goals) {
        if (settings.goals[key].hasOwnProperty("settings")) {
          delete settings.goals[key].settings;
        }
      }
    }
    if (settings.hasOwnProperty("homework")) {
      for (var key in settings.homework) {
        if (settings.homework[key].hasOwnProperty("settings")) {
          delete settings.homework[key].settings;
        }
      }
    }
    if (settings.hasOwnProperty("chatlessons")) {
      for (var key in settings.chatlessons) {
        if (settings.chatlessons[key].hasOwnProperty("settings")) {
          delete settings.chatlessons[key].settings;
        }
      }
    }
    if (settings.hasOwnProperty("pages")) {
      for (var key in settings.pages) {
        if (settings.pages[key].hasOwnProperty("settings")) {
          delete settings.pages[key].settings;
        }
      }
    }
    if (settings.hasOwnProperty("questionnaires")) {
      for (var key in settings.questionnaires) {
        if (settings.questionnaires[key].hasOwnProperty("settings")) {
          delete settings.questionnaires[key].settings;
        }
      }
    }
    if (
      settings.hasOwnProperty("selfhelp") &&
      settings.selfhelp.hasOwnProperty("lessons")
    ) {
      for (var key in settings.selfhelp.lessons) {
        if (settings.selfhelp.lessons[key].hasOwnProperty("settings")) {
          delete settings.selfhelp.lessons[key].settings;
        }
      }
      for (var key in settings.selfhelp.optionalLessons) {
        if (settings.selfhelp.optionalLessons[key].hasOwnProperty("settings")) {
          delete settings.selfhelp.optionalLessons[key].settings;
        }
      }
    }
    return settings;
  };

  const saveSettings = (intervention_id, organisation_id, title, settings) => {
    settings = cleanSettings(settings);

    apiCall({
      action: "save_intervention",
      token: auth.token,
      data: {
        intervention: {
          id: intervention_id,
          title: title,
          settings: settings,
        }
      }
    }).then(resp => {
      dispatch(setSavingStatus("saved"));
      //set settings in global state:
      dispatch(
        setIntervention(
          intervention.id,
          organisation_id,
          resp.title,
          resp.settings /// kan dit of moet de save gewoon alles teruggeven <= dat wordt ook complex .... hier zijn wel de nieuwe toegevoegd items nodig met juiste settings + deleted items....
        )
      );
      setMessage(resp.msg);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    });
  };

  const showTab = tab => {
    setActiveTab(tab);
  };

  return (
    <div className="whiteWrapper intervention_edit">
      <Saved />
      <LeftMenu />
      <div className="container dashboard_container">
        <div className="settings_container">
          <InterventionSettingsTitle
            saveSettings={saveSettings}
            setErrorMessage={setErrorMessage}
          />
          <InterventionSettingsSubTitle
            saveSettings={saveSettings}
            setErrorMessage={setErrorMessage}
          />

          <NavBar showTab={showTab} />
          <br />

          <div
            className={
              errorMessage.length < 1 ? "hidden" : "alert alert-danger"
            }
            role="alert"
          >
            {errorMessage}
          </div>
            {activeTab === "general" ?
              <div id="settings-general">
                <InterventionSettingsLanguage
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />
                <InterventionSettingsType
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />
                {appSettings.introCourseField ?
                  <InterventionSettingsCourseIntro
                    saveSettings={saveSettings}
                    setErrorMessage={setErrorMessage}
                  />
                :<></>}
                <InterventionSettingsCoach
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />
                <InterventionSettingsJournal
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />
                {appSettings.stressmeter == true ?
                  <InterventionSettingsStress
                    saveSettings={saveSettings}
                    setErrorMessage={setErrorMessage}
                  />
                  :<></>}
                {appSettings == true ?
                  <InterventionSettingsApply
                    saveSettings={saveSettings}
                    setErrorMessage={setErrorMessage}
                  />
                  :<></>}
              </div>
             :<></>}
            {activeTab === "lessons" ?
              <div id="settings-lessons">
                <Intro
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                  placeholder={t("Intro lessen")}
                  type="lessons"
                />
                <InterventionSettingsLessons
                  intervention={intervention}
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />

              </div>
           :<></>}

          {activeTab === "optional-lessons" ?
            <div id="settings-optional-lessons">
              <Intro
                saveSettings={saveSettings}
                setErrorMessage={setErrorMessage}
                placeholder={t("Intro optionele lessen")}
                type="optional-lessons"
              />
              <InterventionSettingsOptionalLessons
                intervention={intervention}
                saveSettings={saveSettings}
                setErrorMessage={setErrorMessage}
              />

            </div>
           :<></>}

        {activeTab === "homework" ?
          <div id="settings-homework">
            <Intro
              saveSettings={saveSettings}
              setErrorMessage={setErrorMessage}
              placeholder={t("Intro huiswerk")}
              type="homework"
            />
            <InterventionSettingsHomework
              intervention={intervention}
              saveSettings={saveSettings}
              setErrorMessage={setErrorMessage}
            />
          </div>
         :<></>}
        {activeTab === "chatlessons" ?
          <div id="settings-chatlessons">
            <InterventionSettingsChatlesson
              intervention={intervention}
              saveSettings={saveSettings}
              setErrorMessage={setErrorMessage}
            />
          </div>
         :<></>}
         {activeTab === "goals" ?
           <div id="settings-goals">
             <Intro
               saveSettings={saveSettings}
               setErrorMessage={setErrorMessage}
               placeholder="Intro doelen"
               type="goals"
             />
             <InterventionSettingsGoals
               intervention={intervention}
               saveSettings={saveSettings}
               setErrorMessage={setErrorMessage}
             />
           </div>
         :<></>}
         {activeTab === "questionnaires" ?
           <div
             id="settings-questionnaires"
           >
             <InterventionSettingsQuestionnaires
               intervention={intervention}
               saveSettings={saveSettings}
               setErrorMessage={setErrorMessage}
             />
           </div>
          : <></>}
          {activeTab === "pages" ?
            <div
              id="settings-pages"

            >
              <InterventionSettingsPages
                intervention={intervention}
                saveSettings={saveSettings}
                setErrorMessage={setErrorMessage}
              />
            </div>
           : <></>}
           {activeTab === "translations" ?
             <div
               id="settings-translations"
             >
               <InterventionSettingsTranslations
                 intervention={intervention}
                 saveSettings={saveSettings}
                 setErrorMessage={setErrorMessage}
               />
             </div>
            : <></>}
            { activeTab === 'exam-types' && appSettings.exam ?
              <div id="settings-exam-types">
                <InterventionSettingsExamType />
              </div>
              :<></>}
            { activeTab === 'gamification' && appSettings.gamification ?
              <InterventionSettingsGamification
                setErrorMessage={setErrorMessage}
                saveSettings={saveSettings}
              />
              :<></>}
            { activeTab === 'json' ?
              <div
                id="settings-json"
                className={activeTab === "json" ? "" : "hidden"}
              >
                <InterventionSettingsJson
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />
              </div>
              :<></>}

            {intervention.id > 0 ? (
              <div
                id="settings-theme"
                className={activeTab === "theme" ? "" : "hidden"}
              >
                <InterventionTheme
                  saveSettings={saveSettings}
                  setErrorMessage={setErrorMessage}
                />
              </div>
            ) : (
              ""
            )}
        </div>
      </div>
    </div>
  );
};

export default InterventionEdit;
