import React from "react";
import t from "../../../translate";
import {appSettings} from "../../../../custom/settings";

const ChatCourse = props => {
  return (
    <>
    <div className="question">
      <input
        className="question-input"
        type="radio"
        name="intervention_type"
        id="intervention_type_chatcourse"
        value="chatcourse"
        checked={props.intervention.settings.intervention_type === "chatcourse"}
        onChange={props.onChangeType}
      />
      <label
        htmlFor="intervention_type_chatcourse"
      >
        {t("Chatcursus")}
      </label>
    </div>
    <div className={(props.intervention.settings.intervention_type === 'chatcourse') ? 'marginLeft30' : 'hidden'}>
      <input
          type="checkbox"
          name="guided_selfhelp_view_homework"
          id="guided_selfhelp_view_homework"
          value="1"
          checked={
            props.intervention.settings.selfhelp.guided_selfhelp_view_homework === 1
          }
          onChange={props.onChangeCheck}
        />
      <label
          className="question"
          htmlFor="guided_selfhelp_view_homework"
        >
        {t(appSettings.begeleiderName.toLowerCase() + " mag antwoorden huiswerk inzien")}
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
        {t("contact tussen cursist en " + appSettings.begeleiderName.toLowerCase() + " d.m.v. 'chat' berichten")}
      </label>
    </div>
    </>
  )
}

export default ChatCourse;
