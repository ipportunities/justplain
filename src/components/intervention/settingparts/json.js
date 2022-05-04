import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//import { setIntervention } from "../../../actions";
import { getClone } from "../../utils";
import t from "../../translate";
import apiCall from "../../api";
import { setIntervention } from "../../../actions";

const InterventionSettingsJson = props => {


  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [jsonObjectString, setJsonObjectString] = useState("");

  useEffect(() => {
    setJsonObjectString(JSON.stringify(intervention, undefined, 4));
  }, [intervention]);

  const onChange = (e) => {
    e.preventDefault();
    setJsonObjectString(e.target.value);
  }

  const saveJsonObject = (e) => {
      e.preventDefault();
      setErrorMessage('');
      setMessage('');
      try {
        let newIntervention = JSON.parse(jsonObjectString);
        // bij hit enter in input saved die... met dubbele data tot gevolg
        //saveSettings(newIntervention.id, newIntervention.organisation_id, newIntervention.title, newIntervention.settings);
      } catch(e) {
        setErrorMessage('Geen geldig json Object?');
      }
  }

  const saveSettings = (intervention_id, organisation_id, title, settings) => {
    apiCall({
      action: "save_intervention",
      token: auth.token,
      data: {
        intervention: {
          id: intervention_id,
          title: title,
          settings: settings
        }
      }
    }).then(resp => {
      //set settings in global state:

      dispatch(
        setIntervention(
          intervention.id,
          organisation_id,
          resp.title,
          resp.settings
        )
      );
      setMessage(resp.msg);
      setTimeout(() => {
        setMessage("");
      }, 5000);
    });
  };

  return (
    <div>
      <h4>
        {t("JSON")} {intervention.title}
        </h4>
        <div
            className={message.length < 1 ? "hidden" : "alert alert-success"}
            role="alert"
          >
            {message}
          </div>
          <div
            className={
              errorMessage.length < 1 ? "hidden" : "alert alert-danger"
            }
            role="alert"
          >
            {errorMessage}
          </div>
        <div className="form-group">
        <button
            onClick={saveJsonObject}
            className="btn btn-primary">save Json object</button>
        <textarea
            className="form-control json-textarea"
            id="settings_json"
            name="settings_json"
            value={jsonObjectString}
            onChange={onChange}
            style={{
                height: '2000px'
            }}
            >
        </textarea></div>

    </div>
  );
};

export default InterventionSettingsJson;
