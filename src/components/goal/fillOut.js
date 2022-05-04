import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import t from "../translate";
import ErrorPage from "../error/";
import ContentFront from "../content/front";
import { setIntervention, setActiveGoal } from "../../actions";
import LoadScreen from "../loadScreen";
import { useLocation } from "react-router-dom";

const GoalFillOut = (props) => {

  let location = useLocation();

  const [content, setContent] = useState("");
  const [pagesHistory, setPagesHistory] = useState([]);

  const dispatch = useDispatch();
  const intervention_id = useSelector(state => state.intervention.id);

  const [allowed, setAllowed] = useState('loading');
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("")

  const auth = useSelector(state => state.auth);
  const goal_id = location.pathname.split("/")[4];
  const goal_result_id = location.pathname.split("/")[5];

  const [allAnswers, setAllAnswers] = useState([{the_id:goal_id, answers:[]}]);
  const [answers, setAnswers] = useState({the_id:goal_id, answers:[]});

  const getSettings = goal_id => {
    //api aanroepen
    apiCall({
      action: "get_goal_answers",
      token: auth.token,
      data: {
        id: goal_id,
        result_id:goal_result_id
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
        if (typeof resp.pagesHistory != "undefined" && resp.pagesHistory != null ) {
          setPagesHistory(resp.pagesHistory);
        }
        if(goal_result_id > 0){

          if (Object.keys(resp.answers).length != 0) {
            setAnswers(resp.answers);
            let allAnswersToSet = []
            allAnswersToSet.push(resp.answers)
            setAllAnswers(allAnswersToSet);
          }
        }


        setAllowed(true);
      } else {
        setAllowed(false);
      }
    });
  };

  useEffect(() => {
    dispatch(setActiveGoal(goal_id));
    getSettings(goal_id);
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
            id={goal_id}
            content={content}
            pagesHistory={pagesHistory}
            allAnswers={allAnswers}
            setAllAnswers={setAllAnswers}
            answers={answers}
            setAnswers={setAnswers}
            included='true'
            setActivePart={props.setActivePart}
            type="goal"
            name={t("Doelen")}
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

export default GoalFillOut;
