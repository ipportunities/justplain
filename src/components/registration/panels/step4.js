import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import QuestionnaireT0 from "../../questionnaires/T0";
import apiCall from "../../api";
import t from '../../translate';
import { setQuestionnaire, setAnswersLessons } from "../../../actions";
import LanguageSwitch from './languageSwitch';
import { Cookies, useCookies } from 'react-cookie';


const Step4 = (props) => {

  const dispatch = useDispatch();

  const allAnswers = useSelector(state => state.answersLessons);

  const [t0Id, setT0Id] = useState(0);

  const [showExclusion, setShowExclusion] = useState(false);
  const [exclusionHtml, setExclusionHtml] = useState("");

  const doExclusion = (message) => {
    setExclusionHtml(message);
    setShowExclusion(true);
  }

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  const goToStep = (step) => {

    let nextStep = false;

    if (step === 5)
    {
      
      if (allAnswers.answers[0].hasOwnProperty("finished") && allAnswers.answers[0].finished === true)
      {
        nextStep = 5;
      }
    }
    else
    {
      //sprint nov 2020: ook als men de qualtrics survey heeft ingevuld dan vult men alsnog de gehele T0 in.
      //dus panel 3a overslaan
      /* if (cookies.hasOwnProperty("qualtrics"))
      {
        //qualtrics klant, dus via keuze.
        //props.setStep(99);
        nextStep = 99;
      }
      else
      {
        //props.setStep(3);
        nextStep = 3;
      } */
      nextStep = 3;
    }

    if (nextStep)
    {
      apiCall({
        action: "update_registration",
        data: {
          token: props.token,
          step: 4,
          nextStep
        }
      }).then(resp => {
        props.setStep(nextStep);
      });
    }

  }

  useEffect(() => {

    //api aanroepen
    apiCall({
      action: "get_t0_answers",
      data: {
        language_id: props.language_id,
        token: props.token,
        //questionnaire_id: props.T0_questionnaires[props.intervention_id],
      }
    }).then(resp => {

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

  }, [])

  return (
    <div className="step4">
      {/*<LanguageSwitch changeLanguage={props.changeLanguage} language={props.language}/>*/}
      <div className="container lessoncontent front">
        <div className="step">
          <b>{t("stap 4")}</b> {t("voormeting")}
        </div>
        {
          (!showExclusion) ?
            <QuestionnaireT0 intervention_id={props.intervention_id} language_id={props.language_id} questionnaire_id={t0Id} token={props.token} showExclusion={doExclusion} goToStep={goToStep} />
          :
            <div className="exclusion" dangerouslySetInnerHTML={{__html: exclusionHtml}}></div>

        }
      </div>
    </div>
  )

}

export default Step4;
