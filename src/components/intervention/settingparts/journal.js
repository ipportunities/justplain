import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import { getClone } from "../../utils";
import {appSettings} from "../../../custom/settings";
import Intro from "./intro.js";

let saveSettingsTimeout = null;

const InterventionSettingsJournal = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = e => {
    let interventionC = getClone(intervention);
    if (e.target.checked)
    {
      interventionC.settings.include_journal = 1;
    }
    else
    {
      interventionC.settings.include_journal = 0;
    }
    saveThemSettings(interventionC.settings);
  };

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

        <br />
      <h5>{t(appSettings.dagboekName)}</h5>
      <div className="question">
        <input
            type="checkbox"
            name="include_journal"
            id="include_journal"
            value="1"
            checked={
              intervention.settings.include_journal === 1
            }
            onChange={onChange}
          />
        <label
            className="question"
            htmlFor="include_journal"
          >
          {t(appSettings.dagboekName + " ontsluiten voor deze " + appSettings.interventieName.toLowerCase() + ".")}
        </label>
      </div>
      {intervention.settings.include_journal ?
        <Intro
          saveSettings={props.saveSettings}
          setErrorMessage={setErrorMessage}
          placeholder={t("Intro " + appSettings.dagboekName)}
          type="journal"
        />
      :''}
    </div>
  );
};

export default InterventionSettingsJournal;
