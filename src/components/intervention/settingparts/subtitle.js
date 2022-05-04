import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import ContentEditable from 'react-contenteditable';
import {appSettings} from "../../../custom/settings";

let saveSettingsTimeout = null;

const InterventionSettingsTitle = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChange = e => {
    //e.preventDefault();

    let subtitle = e.target.value;

    //set settings in global state:
    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        intervention.settings
      )
    );

    intervention.settings.subtitle = e.target.value;
    /* const newState = getClone(state);
        newState.subtitle = e.target.value;
        setState(newState); */
    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        intervention.settings
      );
    }, 1500);
  };

  return (
    <div className="form-group">
      <ContentEditable
          id="subtitle"
          html={typeof intervention.settings.subtitle != "undefined" ? intervention.settings.subtitle:''}
          placeholder={t(appSettings.interventieName + " subtitel")}
          disabled={false}
          onChange={onChange}
          className="intervention-subtitle"
        />
    </div>
  );
};

export default InterventionSettingsTitle;
