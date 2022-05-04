import React, { useState, useEffect } from "react";
import InterventionSettingsList from "./list.js";
import t from "../../translate/index.js";

const InterventionSettingsChatlesson = props => {

  return (
    <InterventionSettingsList
      type="chatlesson"
      nest="true"
      optional="true"
      items={typeof props.intervention.settings.chatlessons != "undefined" ? props.intervention.settings.chatlessons:[]}
      intervention={props.intervention}
      setErrorMessage={props.setErrorMessage}
      saveSettings={props.saveSettings}
      placeholderNew={t("Voeg nieuwe chatles toe")}
      placeholderItem={t("Chatles naam")}
      itemName={t("chatles")}
      />
  )
};

export default InterventionSettingsChatlesson;
