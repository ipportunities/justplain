import React, { useState, useEffect } from "react";
import InterventionSettingsList from "./list.js";
import t from "../../translate/index.js";

const InterventionSettingsQuestionnaires = props => {

  return (
    <InterventionSettingsList
      type="questionnaire"
      nest="false"
      items={props.intervention.settings.questionnaires}
      intervention={props.intervention}
      setErrorMessage={props.setErrorMessage}
      saveSettings={props.saveSettings}
      placeholderNew={t("Voeg nieuwe vragenlijst toe")}
      placeholderItem={t("De vragenlijst titel")}
      itemName={'vragenlijst'}
      />
  )
};

export default InterventionSettingsQuestionnaires;
