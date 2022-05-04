import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import QuestionnaireT0 from "../../../questionnaires/T0";
import apiCall from "../../../api";
import t from '../../../translate';
import { setQuestionnaire, setAnswersLessons } from "../../../../actions";

const Step2 = ({token, setStep, intervention_id, language_id}) => {

  const dispatch = useDispatch()

  const allAnswers = useSelector(state => state.answersLessons)

  const [t0Id, setT0Id] = useState(0)

  useEffect(() => {
    //api aanroepen
    apiCall({
      action: "get_t0_answers",
      data: {
        language_id,
        token
      }
    }).then(resp => {
      setT0Id(resp.id)
      dispatch(setQuestionnaire(resp.id, resp.questionnaires))
      dispatch(setAnswersLessons(resp.intervention_id, resp.answers))
    })
  }, [])

  const goToStep = (step) => {
    if (step === 3) {
      if (allAnswers.answers[0].hasOwnProperty("finished") && allAnswers.answers[0].finished === true) {
        apiCall({
          action: "save_registration_chatcourse",
          data: {
            token,
            step: 2,
          }
        }).then(resp => {
          setStep(step);
        })
      }
    } else {
      setStep(step);
    }
  }

  const doExclusion = () => {
    //lege functie tbv QuestionnaireT0
  }

  return(
    <div className="step4">
      <div className="container lessoncontent front">
        <div className="step">
          <b>{t("stap 2")}</b> {t("Aanmelding")}
        </div>
          <QuestionnaireT0 intervention_id={intervention_id} language_id={language_id} questionnaire_id={t0Id} token={token} showExclusion={doExclusion} goToStep={goToStep} />
      </div>
    </div>
  )
}

export default Step2