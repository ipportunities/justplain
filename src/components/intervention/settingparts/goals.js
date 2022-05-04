import React, { useState, useEffect } from "react";
import InterventionSettingsList from "./list.js";
import t from "../../translate";

const InterventionSettingsGoals = props => {

  return (
    <InterventionSettingsList
      type="goal"
      nest="false"
      items={props.intervention.settings.goals}
      intervention={props.intervention}
      setErrorMessage={props.setErrorMessage}
      saveSettings={props.saveSettings}
      placeholderNew={t("Voeg nieuw doel toe")}
      placeholderItem={t("Titel doel")}
      itemName={t("doel")}
      />
  )
};

export default InterventionSettingsGoals;
