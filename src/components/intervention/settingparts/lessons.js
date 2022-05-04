import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention } from "../../../actions";
import InterventionSettingsList from "./list.js";
import t from "../../translate";
import { getClone } from "../../utils";
import {appSettings} from "../../../custom/settings";

let saveSettingsTimeout = null;

const InterventionSettingsLessons = props => {

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChangeAlternativeMenu = (e) => {

      let interventionC = getClone(intervention);
      if (interventionC.settings.selfhelp.alternative_menu !== 'undefined')
      {
        interventionC.settings.selfhelp.alternative_menu = !interventionC.settings.selfhelp.alternative_menu;
      }
      else
      {
        interventionC.settings.selfhelp.alternative_menu = true;
      }
      saveThemSettings(interventionC.settings);
  }

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
    <>
      {appSettings.alternative_menu ?
        <div className="question" style={{paddingLeft:"20px"}}>
          <input
            type="checkbox"
            name="alternative_menu"
            id="alternative_menu"
            value="true"
            checked={typeof intervention.settings.selfhelp.alternative_menu != "undefined" && intervention.settings.selfhelp.alternative_menu === true}
            onChange={onChangeAlternativeMenu}
          />
          <label
            htmlFor="alternative_menu"
          >
            {t("Alternatief menu (met afbeeldingen)")}
          </label>
          <br />
        </div>
      :''}

      <InterventionSettingsList
        type="lesson"
        nest="true"
        items={props.intervention.settings.selfhelp.lessons}
        intervention={props.intervention}
        setErrorMessage={props.setErrorMessage}
        saveSettings={props.saveSettings}
        placeholderNew={t("Voeg nieuwe les toe")}
        placeholderItem={t("De les titel")}
        itemName={t("les")}
        />
    </>
  )
};

export default InterventionSettingsLessons;
