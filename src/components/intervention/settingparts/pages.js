import React, { useState, useEffect } from "react";
import InterventionSettingsList from "./list.js";
import t from "../../translate/index.js";

const InterventionSettingsPages = props => {

  return (
    <InterventionSettingsList
      type="page"
      nest="false"
      items={props.intervention.settings.pages}
      intervention={props.intervention}
      setErrorMessage={props.setErrorMessage}
      saveSettings={props.saveSettings}
      placeholderNew={t("Voeg nieuwe pagina toe")}
      placeholderItem={t("De pagina titel")}
      itemName={t("pagina")}
      />
  )
};

export default InterventionSettingsPages;
