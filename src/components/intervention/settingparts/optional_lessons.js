import React, { useState, useEffect } from "react";
import InterventionSettingsList from "./list.js";
import t from "../../translate/index.js";

const InterventionSettingsLessons = props => {

  return (
    <InterventionSettingsList
      type="optional_lesson"
      nest="true"
      optional="true"
      items={props.intervention.settings.selfhelp.optionalLessons}
      intervention={props.intervention}
      setErrorMessage={props.setErrorMessage}
      saveSettings={props.saveSettings}
      placeholderNew={t("Voeg nieuwe les toe")}
      placeholderItem={t("De les titel")}
      itemName={t("les")}
      />
  )
};

export default InterventionSettingsLessons;
