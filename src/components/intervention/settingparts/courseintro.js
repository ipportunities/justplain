import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import { getClone } from "../../utils";
import {appSettings} from "../../../custom/settings";
import Intro from "./intro.js";

let saveSettingsTimeout = null;

const InterventionSettingsCourseIntro = props => {
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="form-group">


      <h5>{t("Intro " + appSettings.interventieName.toLowerCase())}</h5>
      <Intro
        saveSettings={props.saveSettings}
        setErrorMessage={setErrorMessage}
        placeholder={t("Intro " + appSettings.interventieName.toLowerCase())}
        type="courseIntro"
      />
      <br />
    </div>
  );
};

export default InterventionSettingsCourseIntro;
