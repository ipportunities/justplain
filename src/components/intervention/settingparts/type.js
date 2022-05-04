import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import Guidedselfhelp from "./type/guided_selfhelp";
import ChatCourse from "./type/chat_course";
import {appSettings} from "../../../custom/settings";
import { getClone } from "../../utils";

let saveSettingsTimeout = null;

const InterventionSettingsType = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChangeType = e => {
    let type = e.target.value;
    //set settings in store:
    let interventionC = getClone(intervention);
    interventionC.settings.intervention_type = type;
    saveThemSettings(interventionC.settings);
  };

  const onChangeCheck = e => {
    let interventionC = getClone(intervention);
    if (e.target.checked)
    {
      interventionC.settings.selfhelp[e.target.id] = 1;
    }
    else
    {
      interventionC.settings.selfhelp[e.target.id] = 0;
    }
    saveThemSettings(interventionC.settings);
  }
  /*
  const [sessions, setSessions] = useState('')

  useEffect(() => {
    if(typeof intervention.settings.chatsessions != "undefined"){
      setSessions(intervention.settings.chatsessions)
    }
  }, [intervention]);

  const changeSessions = (sessions) => {
    let interventionC = getClone(intervention);
    interventionC.settings.chatsessions = sessions;
    setSessions(sessions)
    saveThemSettings(interventionC.settings);
  }
  */


  const saveThemSettings = (newSettings) => {

    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        newSettings
      )
    );

    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        newSettings
      );
    }, 1500);
  }

  return (
    <div className="form-group">
      <h5>{t("Type " + appSettings.interventieName.toLowerCase())}</h5>
      <div className="question">
        <input
          type="radio"
          name="intervention_type"
          id="intervention_type_selfhelp"
          value="selfhelp"
          checked={typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "selfhelp"}
          onChange={onChangeType}
        />
        <label
          htmlFor="intervention_type_selfhelp"
        >
          {t(appSettings.zelhulpName)}
        </label>
      </div>
      <Guidedselfhelp onChangeCheck={onChangeCheck} onChangeType={onChangeType} intervention={intervention} />

      {appSettings.chatCourseAvailable ?
        <ChatCourse onChangeCheck={onChangeCheck} onChangeType={onChangeType} intervention={intervention} />
        :<></>}
      {
        /*
        typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "chatcourse" ?
          <>
            <br/>
            <div class="form-group">
              <h5>{t("Aantal sessies")}</h5>
              <input
                type="number"
                className="form-control"
                placeholder={t("Aantal sessies")}
                value={sessions}
                onChange={e => changeSessions(e.target.value)}
              />
            </div>
          </>
          :<></>
        */
      }
    </div>
  );
};

export default InterventionSettingsType;
