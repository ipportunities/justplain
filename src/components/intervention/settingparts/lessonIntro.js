import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention } from "../../../actions";
import t from "../../translate";
import ContentEditable from 'react-contenteditable';
import {appSettings} from "../../custom/settings";

let saveSettingsTimeout = null;

const InterventionLessonIntro = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChange = e => {
    //e.preventDefault();

    let lessonIntro = e.target.value;

    //set settings in global state:
    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        intervention.settings
      )
    );

    intervention.settings.lessonIntro = e.target.value;
    /* const newState = getClone(state);
        newState.lessonIntro = e.target.value;
        setState(newState); */
    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);

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
    <div className="lessonIntro">
      <ContentEditable
          html={typeof intervention.settings.lessonIntro != "undefined" ? intervention.settings.lessonIntro:''}
          placeholder="Interventie lesintro"
          disabled={false}
          onChange={onChange}
          className="intervention-lesIntro"
        />
    </div>
  );
};

export default InterventionLessonIntro;
