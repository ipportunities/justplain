import React from "react";
import t from "../../../translate";
import {appSettings} from "../../../../custom/settings";

const Guidedselfhelp = props => {

  return (
    <>
    <div className="question">
      <input
        type="radio"
        name="intervention_type"
        id="intervention_type_guided_selfhelp"
        value="guided_selfhelp"
        checked={
          props.intervention.settings.intervention_type === "guided_selfhelp"
        }
        onChange={props.onChangeType}
      />
      <label
        className="question"
        htmlFor="intervention_type_guided_selfhelp"
      >
        {t(appSettings.begeleideZelhulpName)}
      </label>
    </div>
    <div className={(props.intervention.settings.intervention_type === 'guided_selfhelp') ? 'marginLeft30' : 'hidden'}>
      <input
          type="checkbox"
          name="guided_selfhelp_view_lessons"
          id="guided_selfhelp_view_lessons"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_view_lessons === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_view_lessons"
        >
        {t(appSettings.begeleiderName.toLowerCase() + " mag antwoorden lessen inzien")}
      </label>
      <br />
      <input
          type="checkbox"
          name="guided_selfhelp_view_goals"
          id="guided_selfhelp_view_goals"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_view_goals === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_view_goals"
        >
        {t(appSettings.begeleiderName.toLowerCase() + " mag doelen inzien")}
      </label>
      <br />
      <input
          type="checkbox"
          name="guided_selfhelp_view_questionnaires"
          id="guided_selfhelp_view_questionnaires"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_view_questionnaires === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_view_questionnaires"
        >
        {t(appSettings.begeleiderName.toLowerCase() + " mag ingevulde vragenlijsten inzien")}
      </label>
      <br />
      <input
          type="checkbox"
          name="guided_selfhelp_view_log"
          id="guided_selfhelp_view_log"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_view_log === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_view_log"
        >
        {t(appSettings.begeleiderName.toLowerCase() + " mag log inzien")}
      </label>
      <br />
      <input
          type="checkbox"
          name="guided_selfhelp_chat_contact"
          id="guided_selfhelp_chat_contact"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_chat_contact === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_chat_contact"
        >
        {t("contact tussen cursist en " + appSettings.begeleiderName.toLowerCase() + " d.m.v. 'messaging'")}
      </label>

      {appSettings.liveChatAvailable ?
        <>
          <br />
          <input
              type="checkbox"
              name="guided_selfhelp_live_chat"
              id="guided_selfhelp_live_chat"
              value="1"
              checked={
                props.intervention.settings.selfhelp.guided_selfhelp_live_chat === 1
              }
              onChange={props.onChangeCheck}
            />
          <label
              className="question"
              htmlFor="guided_selfhelp_live_chat"
            >
            {t("live chat tussen cursist en " + appSettings.begeleiderName.toLowerCase())}
          </label>
        </>
        :false
      }

      <br />
      <input
          type="checkbox"
          name="guided_selfhelp_plan_contact"
          id="guided_selfhelp_plan_contact"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_plan_contact === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_plan_contact"
        >
        {t(appSettings.begeleiderName.toLowerCase() + " kan afspraken inplannen")}
      </label>
    </div>
    </>
  )
}

export default Guidedselfhelp;
