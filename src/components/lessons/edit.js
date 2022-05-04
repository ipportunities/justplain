import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LeftMenu from "../dashboard/leftmenu";
import ContentEdit from "../content/edit";
import apiCall from "../api";
import ErrorPage from "../error";
import { setIntervention } from "../../actions";
import LoadScreen from "../loadScreen"
import { useLocation } from "react-router-dom";
import t from "../translate"
import {appSettings} from "../../custom/settings";

const QuestionnaireEdit = props => {
  let location = useLocation();
  const [content, setContent] = useState("");
  const [contentIndex, setContentIndex] = useState(0);
  const [optionalLesson, setOptionalLesson] = useState(false);

  const [allowed, setAllowed] = useState("loading");

  const lesson_id = location.pathname.split("/")[3];
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
    //"question_right_or_wrong",//niet af aan begonnen maar toch niet nodig
    "slider",
    "video",
    "audio",
    "image",
    "select",
    "special",
    "divider",
    "chart",
    "feedback",
    "matrix",
    "form",
    "custom",
    "goal",
    "datepicker",
  ];

  if(appSettings.wordpress_import){
    options.push("wordpress");
  }

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

          setOptionalLesson(resp.optionalLesson)

          if(false == resp.optionalLesson)
          {
            let this_item_obj = resp.intervention_settings.selfhelp.lessons.filter(function (item) {
              return item.id === lesson_id
            });
            setContentIndex(resp.intervention_settings.selfhelp.lessons.indexOf(this_item_obj[0]))
          } else {
            let this_item_obj = resp.intervention_settings.selfhelp.optionalLessons.filter(function (item) {
              return item.id === lesson_id
            });
            setContentIndex(resp.intervention_settings.selfhelp.optionalLessons.indexOf(this_item_obj[0]))
          }

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
        <div>
          <ContentEdit
            id={lesson_id}
            options={options}
            content={content}
            contentIndex={contentIndex}
            type="lesson"
            name={t((optionalLesson ? 'optionele ':'') +"lessen")}
            saveAction="save_lesson"
            url={(optionalLesson ? 'optional-':'') + "lessons"}
          />
        </div>
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

export default QuestionnaireEdit;
