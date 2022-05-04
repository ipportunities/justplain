import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import {appSettings} from "../../../custom/settings";
import { getClone } from "../../utils";

let saveSettingsTimeout = null;

const InterventionSettingsApply = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChange = e => {
    let apply = e.target.value;

    //set settings in store:
    let interventionC = getClone(intervention);
    interventionC.settings.apply = apply;
    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        interventionC.settings
      )
    );

    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));
    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        interventionC.settings
      );
    }, 1500);
  };

  return (
    <div className="form-group">
      <br />
      <h5>{t("Aanmelden")}</h5>
      <div className="question">
        <input
          type="radio"
          name="intervention_apply"
          id="intervention_apply_oninvite"
          value="oninvite"
          checked={typeof intervention.settings.apply != "undefined" && intervention.settings.apply === "oninvite"}
          onChange={onChange}
        />
        <label
          htmlFor="intervention_apply_oninvite"
        >
          {t("Op uitnodiging van " + appSettings.begeleiderName.toLowerCase())}
        </label>
      </div>
      <div className="question">
        <input
          type="radio"
          name="intervention_apply"
          id="intervention_apply_public"
          value="public"
          checked={intervention.settings.apply === "public"}
          onChange={onChange}
        />
        <label htmlFor="intervention_apply_public">
          {t("Via openbaar online formulier")}
        </label>
      </div>
    </div>
  );
};

export default InterventionSettingsApply;
