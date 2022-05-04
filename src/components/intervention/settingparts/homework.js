import React, { useState, useEffect } from "react";
import InterventionSettingsList from "./list.js";
import t from "../../translate/index.js";

const InterventionSettingsHomework = props => {

  return (
    <InterventionSettingsList
      type="homework"
      nest="true"
      optional="true"
      items={typeof props.intervention.settings.homework != "undefined" ? props.intervention.settings.homework:[]}
      intervention={props.intervention}
      setErrorMessage={props.setErrorMessage}
      saveSettings={props.saveSettings}
      placeholderNew={t("Voeg nieuw huiswerk toe")}
      placeholderItem={t("Huiswerk naam")}
      itemName={t("huiswerk")}
      />
  )
};

export default InterventionSettingsHomework;
