import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useParams } from 'react-router-dom';
import Header from './panels/header';
import Footer from './panels/footer';
import t from '../../translate';
import apiCall from '../../api';
import Step1 from './panels/step1';
import Step2 from './panels/step2';
import Step3 from './panels/step3';

const Registration = (props) => {

  const dispatch = useDispatch()

  const { ac } = useParams()
  const { dtc } = useParams()

  const [showLoading, setShowLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [step, setStep] = useState(1)
  const [sinaiDeelnemer, setSinaiDeelnemer] = useState(false)
  const [token, setToken] = useState('')
  const [getLastQuerstionniare, setGetLastQuestionaire] = useState(false)

  ////2022-3-28 dit is om terug te kunnen naar de laatste vragenlijst vanaf het laatste scherm
  /// questionnaires van de eerste vragenlijst werden geladen
  useEffect(() => {
    if(getLastQuerstionniare){
      setGetLastQuestionaire(false)
    }
  }, [getLastQuerstionniare])

  useEffect(() => {

    apiCall({
      action: "check_registration_params_koozh",
      data: {
        ac,
        dtc
      }
    }).then(resp => {
      if (resp.succes) {
        setToken(resp.token)
        setSinaiDeelnemer(resp.sinaiDeelnemer)
        setShowLoading(false);
        setShowForm(true);
      } else {
        setShowLoading(false);
        setErrorMessage(resp.msg);
      }
    })

  }, [])

  const getStep = () => {
    switch (step) {
      case 2:
        return (
          <Step2 token={token} ac={ac} dtc={dtc} sinaiDeelnemer={sinaiDeelnemer} setStep={setStep} step={step} getLastQuerstionniare={getLastQuerstionniare}/>
        )
      case 3:
        return (
          <Step3 ac={ac} dtc={dtc} sinaiDeelnemer={sinaiDeelnemer} setStep={setStep} setGetLastQuestionaire={setGetLastQuestionaire}/>
        )
      default:
        return (
          <Step1 ac={ac} dtc={dtc} sinaiDeelnemer={sinaiDeelnemer} setStep={setStep} />
        )
    }
  }

  return (
    <div className="registrationContainer theme_4">
      <link rel="stylesheet" type="text/css" href={require('../../../custom/themes/4/index.scss')} />
      <Header />
      <div className="holder_container">
        {
          errorMessage.length > 0 ?
          <div className="step1">
            <div className="container registrationError">
              <h1>{t("Registratie")}</h1>
              {errorMessage}
              <br/><br/>
              <a className='btn btn-primary login' href="/">{t("Log in")}</a>
            </div>
          </div> : <></>
        }

        {
          showForm ?
            <div className="container">
              {
                getStep()
              }
            </div> : <></>
        }

        {
          showLoading ?
            <div className="step1">
              <div className="container">
                <h2>{t("Registratie")}</h2>
                {t("Een moment, uw registratiegegevens worden gechecked.")}
                <br /><br />
                <div className="loader"></div>
              </div>
            </div> : <></>
        }

        </div>

      <Footer />

    </div>
  )
}

export default Registration;
