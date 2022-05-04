import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import { getClone } from "../../utils";
import apiCall from "../../api";

let saveSettingsTimeout = null;

const InterventionSettingsType = props => {
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    //api aanroepen, talen ophalen
    apiCall({
      action: "get_languages",
      token: auth.token,
      data: {}
    }).then(resp => {
      setLanguages(resp.languages);
    });
  }, []);

  const onChange = e => {
    let language_id = e.target.value;
    //set settings in store:
    let interventionC = getClone(intervention);
    interventionC.settings.language_id = language_id;
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
      <h5>{t("Taal")}</h5>
      <div className="question">
        <select
          name="language_id"
          id="language_id"
          onChange={onChange}
          value={intervention.settings.language_id}
        >
          {
            languages.map((language, index) => {
              return (
                <option key={index} value={language.id}>{language.language}</option>
              )
            })
          }
        </select>
      </div>
    </div>
  );
};

export default InterventionSettingsType;
