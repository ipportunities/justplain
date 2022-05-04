import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import t from "../translate";
import ErrorPage from "../error/";
import ContentFront from "../content/front";
import { setIntervention } from "../../actions";
import LoadScreen from "../loadScreen";
import { useLocation } from "react-router-dom";


const QuestionnaireFillOut = () => {

  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  let location = useLocation();

  const dispatch = useDispatch();
  const intervention_id = useSelector(state => state.intervention.id);

  const [allowed, setAllowed] = useState('loading');
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const auth = useSelector(state => state.auth);
  const questionnaire_id = location.pathname.split("/")[2];

  const getSettings = questionnaire_id => {
    //api aanroepen
    apiCall({
      action: "get_questionnaire_answers",
      token: auth.token,
      data: {
        id: questionnaire_id
      }
    }).then(resp => {
      if(resp.error == 0)
      {
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
          setContent(resp.settings);
        }
        if (Object.keys(resp.answers).length != 0) {
          setAnswers(resp.answers);
        }

        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });
  };

  useEffect(() => {
    getSettings(questionnaire_id);
  }, []);

  return (
    <div>
      {allowed == true ?
        <div>
          <div
            className={message.length < 1 ? "hidden" : "alert alert-success"}
            role="alert"
          >
            {message}
          </div>
          <div
            className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
            role="alert"
          >
            {errorMessage}
          </div>

          <ContentFront
            id={questionnaire_id}
            content={content}
            answers={answers}
            allAnswers=''
            type="questionnaire"
            />

        </div>
      :
      <div>
        {allowed == "loading" ? <div><LoadScreen/></div>:<div><ErrorPage/></div>}
      </div>
    }
    </div>
  )
};

export default QuestionnaireFillOut;
