import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import QuestionnaireT0 from "../../../questionnaires/T0_koozh";
import apiCall from "../../../api";
import t from '../../../translate';
import { setQuestionnaire, setAnswersLessons, setActiveSubLesson } from "../../../../actions";

const Step2 = (props) => {

  const dispatch = useDispatch();

  const allAnswers = useSelector(state => state.answersLessons);

  const [t0Id, setT0Id] = useState(0);

  const [showExclusion, setShowExclusion] = useState(false);
  const [exclusionHtml, setExclusionHtml] = useState("");
  const [part, setPart] = useState(1); //toegevoegd tbv T0 GetStarted (RCT), deze bestaat uit 2 delen: #214 en #215

  const doExclusion = (message) => {
    setExclusionHtml(message);
    setShowExclusion(true);
  }

  const goToStep = (step) => {

    if (step === 1) {
      if (part === 2) {
        dispatch(setActiveSubLesson(2))
        setPart(1)
        get_T0(1)
      } else {
        props.setStep(1)
      }
    }

    if (step === 3) {
      if (part === 1) {
        dispatch(setActiveSubLesson(0))
        setPart(2)
        get_T0(2)
      } else {
        props.setStep(3)
      }
    }

  }

  useEffect(() => {
    if(props.getLastQuerstionniare){
      get_T0(2);
    } else {
      get_T0(1);
    }

  }, [])

  const get_T0 = (part) => {
    //api aanroepen
    apiCall({
      action: "get_t0_answers_koozh",
      token: props.token,
      data: {
        language_id: props.language_id,
        part
      }
    }).then(resp => {

      setPart(part);

      setT0Id(resp.id);

      dispatch(
        setQuestionnaire(
          resp.id,
          resp.questionnaires,
        )
      )

      dispatch(
        setAnswersLessons(
          resp.intervention_id,
          resp.answers
          )
      )
    });
  }

  return (
    <div className="step4 step">
      <h1>Registratie stap 2</h1>
      <div className="container lessoncontent front">
        <QuestionnaireT0 intervention_id="" language_id={1} questionnaire_id={t0Id} token={props.token} goToStep={goToStep} />
      </div>
    </div>
  )

}

export default Step2;
