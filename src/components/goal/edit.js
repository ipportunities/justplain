import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LeftMenu from "../dashboard/leftmenu";
import ContentEdit from "../content/edit";
import apiCall from "../api";
import ErrorPage from "../error";
import { setIntervention } from "../../actions";
import LoadScreen from "../loadScreen";
import t from "../translate";
import { useLocation } from "react-router-dom";

const GoalEdit = props => {
  let location = useLocation();
  const [contentIndex, setContentIndex] = useState(0)
  const [action, setAction] = useState(false);
  const [content, setContent] = useState("");
  const [allowed, setAllowed] = useState("loading");

  const goal_id = location.pathname.split("/")[3];
  const intervention_id = useSelector(state => state.intervention.id);
  const intervention_title = useSelector(state => state.intervention.title);
  const [editable, setEditability] = useState("false");
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
    "audio",
    "image",
    "select",
    "special",
    "divider",
    "chart",
    //"feedback",
    "matrix",
    "slider",
    "datepicker",
    "custom",

  ];

  //////////////////////
  ///On init
  useEffect(() => {
    checkIfAllowedToEdit();
    if(props.action != ""){
      setAction(props.action);
    }
  }, []);

  //////////////////////
  ///Check if its allowed to edit
  function checkIfAllowedToEdit() {
    let apiMsg = {
      action: "get_goal",
      token: auth.token,
      data: {
        id: goal_id
      }
    };

    apiCall(apiMsg).then(resp => {
      if (resp) {
        dispatch(
          setIntervention(
            resp.intervention_id,
            resp.organisation_id,
            resp.intervention_title,
            resp.intervention_settings
          )
        );
        if (Object.keys(resp.settings).length != 0) {
          /// is de leeg dan niet
          resp.settings.newPart = false;
          resp.settings.removePart = false;
          setContent(resp.settings);
          let this_item_obj = resp.intervention_settings.goals.filter(function (item) {
            return item.id === goal_id
          });
          setContentIndex(resp.intervention_settings.goals.indexOf(this_item_obj[0]))
        }
        setEditability(true);
        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });
  }

  return (
    <div>
      <LeftMenu />
      {editable == true ? (
        <ContentEdit
          id={goal_id}
          options={options}
          content={content}
          contentIndex={contentIndex}
          type="goal"
          name={t("doelen")}
          saveAction="save_goal"
          action={action}
          url={"goals"}
        />
      ) : (
        <div>
          {allowed == "loading" ? <div><LoadScreen/></div>:<div>
          <ErrorPage/>
          </div>}
        </div>
      )}
    </div>
  );
};

export default GoalEdit;
