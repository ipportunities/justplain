import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention } from "../../../actions";
import t from "../../translate";
import { getClone } from "../../utils";

let saveSettingsTimeout = null;

const InterventionSettingsSelfhelpGuided = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);

  const onChange = e => {
    let guided = e.target.value;
    if (guided === "true") {
      guided = true;
    } else {
      guided = false;
    }

    //set settings in store:
    let interventionC = getClone(intervention);
    interventionC.settings.selfhelp.guided = guided;
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
    <div
      className="form-group"
      className={
        intervention.settings.intervention_type === "selfhelp" ? "" : "hidden"
      }
    >
      <br />
      <strong>{t("Type zelfhulp")}</strong>
      <div className="light-text">
        {t(
          "Geef aan of de deelnemer de interventie geheel zelfstandig doorloopt of dit onder supervisie van een coach doet die meekijkt en eventueel aanwijzingen geeft."
        )}
      </div>

      <br />
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="intervention_selfhelp_guided"
          id="intervention_selfhelp_guided_true"
          value="true"
          checked={intervention.settings.selfhelp.guided}
          onChange={onChange}
        />
        <label
          className="form-check-label"
          htmlFor="intervention_type_selfhelp"
        >
          {t("Begeleide zelfhulp")}
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="intervention_selfhelp_guided"
          id="intervention_selfhelp_guided_false"
          value="false"
          checked={!intervention.settings.selfhelp.guided}
          onChange={onChange}
        />
        <label
          className="form-check-label"
          htmlFor="intervention_selfhelp_guided_false"
        >
          {t("Onbegeleide zelfhulp")}
        </label>
      </div>
    </div>
  );
};

export default InterventionSettingsSelfhelpGuided;
