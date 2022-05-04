import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import {appSettings} from "../../../custom/settings";
import ContentEditable from 'react-contenteditable';

let saveSettingsTimeout = null;

const InterventionSettingsTitle = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChange = e => {
    //e.preventDefault();

    let title = e.target.value;

    //set settings in global state:
    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        title,
        intervention.settings
      )
    );

    /* const newState = getClone(state);
        newState.title = e.target.value;
        setState(newState); */
    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        intervention.id,
        intervention.organisation_id,
        title,
        intervention.settings
      );
    }, 1500);
  };

  return (
    <div className="form-group">
      <ContentEditable
          id="title"
          html={intervention.title}
          placeholder={t(appSettings.interventieName + " titel")}
          disabled={false}
          onChange={onChange}
          className="intervention-title"
        />
    </div>
  );
};

export default InterventionSettingsTitle;
