import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LeftMenu from "../dashboard/leftmenu";
import ContentEdit from "../content/edit";
import apiCall from "../api";
import ErrorPage from "../error";
import { setIntervention } from "../../actions";
import LoadScreen from "../loadScreen";
import { useLocation } from "react-router-dom";


const LessonJson = props => {
    
  //const [content, setContent] = useState("");
  let location = useLocation();

  //const [allowed, setAllowed] = useState("loading");
  const [jsonObjectString, setJsonObjectString] = useState("");
  const [jsonObject, setJsonObject] = useState({});
  const lesson_id = location.pathname.split("/")[3];
  const intervention_id = useSelector(state => state.intervention.id);
  //const [editable, setEditability] = useState("false");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const options = [
    "quote",
    "list",
    "wysiwyg",
    "question_checkboxes",
    "question_radio",
    "question_open",
    "video",
    "image",
    "select",
    "special",
    "divider",
    "chart",
    "feedback"
  ];

  //////////////////////
  ///On init
  useEffect(() => {
    checkIfAllowedToEdit();
  }, []);

  //////////////////////
  ///Check if its allowed to edit
  function checkIfAllowedToEdit() {
    let apiMsg = {
      action: "get_lesson",
      token: auth.token,
      data: {
        id: lesson_id
      }
    };

    apiCall(apiMsg).then(resp => {

        if (intervention_id == 0) {
          dispatch(
            setIntervention(
              resp.intervention_id,
              resp.organisation_id,
              resp.intervention_title,
              resp.intervention_settings
            )
          );

        }
        if (Object.keys(resp.settings).length != 0) {
            setJsonObject(resp.settings);
            setJsonObjectString(JSON.stringify(resp.settings, undefined, 4));
          /// is de leeg dan niet

          //resp.settings.newPart = false;
          //resp.settings.removePart = false;
          //setContent(resp.settings);
        }
        //setEditability(true);
        //setAllowed(true);

    });
  }

  const onChange = (e) => {
    e.preventDefault();
    setJsonObjectString(e.target.value);
  }

  const saveJsonObject = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');
    try {
      let settings = JSON.parse(jsonObjectString);

      apiCall({
        action: "save_lesson", 
        token: auth.token,
        data: {
          id: lesson_id,
          settings
        }
      })
      .then(resp => {
        setMessage('Les opgeslagen');
      })

    } catch(e) {
      setErrorMessage('Geen geldig json Object?');
    }
  }

  return (
    <div>
      <LeftMenu />

        <div className="center">
            <br /><br /><br /><br />
        <h4>
          JSON {jsonObject.title}
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
              id="lesson_json"
              name="lesson_json"
              value={jsonObjectString}
              onChange={onChange}
              style={{
                  height: '2000px'
              }}
              >
          </textarea></div>
  
      </div>
      
    </div>
  );
};

export default LessonJson;
