import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import { getClone } from "../../utils";
import {appSettings} from "../../../custom/settings";
import Intro from "./intro.js";

let saveSettingsTimeout = null;

const InterventionSettingsStress = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const [errorMessage, setErrorMessage] = useState("");

  const onChange = e => {
    let interventionC = getClone(intervention);
    if (e.target.checked)
    {
      interventionC.settings.include_stress_meter = 1;
    }
    else
    {
      interventionC.settings.include_stress_meter = 0;
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
      <h5>{t("Stressmeter")}</h5>
      <div className="question">
        <input
            type="checkbox"
            name="include_stress_meter"
            id="include_stress_meter"
            value="1"
            checked={
              intervention.settings.include_stress_meter === 1
            }
            onChange={onChange}
          />
        <label
            className="question"
            htmlFor="include_stress_meter"
          >
          {t("Stressmeter ontsluiten voor deze " + appSettings.interventieName.toLowerCase() + ".")}
        </label>
      </div>
      {intervention.settings.include_stress_meter === 1 ?
        <Intro
          saveSettings={props.saveSettings}
          setErrorMessage={setErrorMessage}
          placeholder={t("Intro stress")}
          type="stress"
        />
      :''}
    </div>
  );
};

export default InterventionSettingsStress;
