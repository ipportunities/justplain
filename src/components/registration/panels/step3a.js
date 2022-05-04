import React, { useState, useEffect } from 'react';
import apiCall from "../../api";
import { getClone, iso_3166 } from "../../utils";
import t from '../../translate';
import NotificationBox from "../../alert/notification";


const Step3a = (props) => {

  const [qualtricsLongerThen1WeekAgo, setQualtricsLongerThen1WeekAgo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setQualtricsLongerThen1WeekAgo(props.registrationData.qualtricsLongerThen1WeekAgo);
  }, []);

  const errorMessages = [
    {
      nl: 'Geef aan of u de survey van Caring Universities langer dan één week geleden heeft ingevuld.',
      eng: 'Indicate whether you completed the Caring Universities survey more than one week ago.',
    },
  ]

  const onChangeQLT1WA = (e) => {
    setQualtricsLongerThen1WeekAgo(e.target.value);
  }

  const [notificationOptions, setNotificationOptions] = useState({});

  const goToStep = (step) => {
    
    setErrorMessage("");

    let nextStep = 4;
    if (parseInt(step) === 4)
    {
      /*
      if (parseInt(qualtricsLongerThen1WeekAgo) === 1)
      {
        nextStep = 4;
      }
      else
      {
        //T0 overslaan...
        nextStep = 5;
      }
      */
     nextStep = 4;
    }
    else
    {
      nextStep = 3;
    }

    apiCall({
      action: "update_registration",
      data: {
        language_id: props.language_id,
        token: props.token,
        step: 99, //99 = 3a
        nextStep,
        qualtricsLongerThen1WeekAgo
      }
    }).then(resp => {
      if (resp.msg === 'OK')
      {
        updateRegistrationData(qualtricsLongerThen1WeekAgo);
        props.setStep(nextStep);        
      }
      else
      {
        let errorMessage = errorMessages[parseInt(resp.msg)-1].nl;
        if (props.language_id === 2)
        {
          errorMessage = errorMessages[parseInt(resp.msg)-1].eng;
        }

        setNotificationOptions({
          show: "true",
          text: errorMessage,
          confirmText: t("Ok"),
        });

      }
    });

  }

  const updateRegistrationData = (qualtricsLongerThen1WeekAgo) => {
    let newRegistrationData = getClone(props.registrationData);
    newRegistrationData.qualtricsLongerThen1WeekAgo = qualtricsLongerThen1WeekAgo;
    props.setRegistrationData(newRegistrationData);
  }

 return (
    <div className="step3a">
      <button type="button" className="btn prev" onClick={() => props.setStep(3)}>{t("Terug")}</button>
      {/*<LanguageSwitch changeLanguage={props.changeLanguage} language={props.language}/>*/}
      <div className="container">
        <div className="step">
          <b>{t("stap 3")}</b> {t("Survey Caring Universities")}
        </div>
        <div>
          {t("Je hebt recentelijk de survey van Caring Universities gedaan. Nogmaals bedankt daarvoor!")}
          <br />
          {t("Heb je de survey langer dan één week geleden gedaan?")}
        </div>
        <div className="form-row align-items-center bigLabel">
          <div className="col">
            <br />
            <input
              type="radio"
              className="form-control"
              id="qualtricsLongerThen1WeekAgo_Y"
              name="qualtricsLongerThen1WeekAgo"
              aria-describedby="qualtricsLongerThen1WeekAgo"
              value="1"
              onChange={onChangeQLT1WA}
              checked={parseInt(qualtricsLongerThen1WeekAgo) === 1}
            /> <label htmlFor="qualtricsLongerThen1WeekAgo_Y">{t("Ja")}</label>
            <input
              type="radio"
              className="form-control"
              id="qualtricsLongerThen1WeekAgo_N"
              name="qualtricsLongerThen1WeekAgo"
              aria-describedby="qualtricsLongerThen1WeekAgo"
              value="0"
              onChange={onChangeQLT1WA}
              checked={parseInt(qualtricsLongerThen1WeekAgo) === 0}
              /> <label htmlFor="qualtricsLongerThen1WeekAgo_N">{t("Nee")}</label>
          </div>
        </div>
        <div
          className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
          role="alert"
          >
            <i className="fas fa-exclamation-circle"></i> &nbsp;
            <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
          </div>
        <div className="navigation">
          <button type="button" className="btn btn-primary next" onClick={() => goToStep(4)}>{t("Vervolg de aanmelding")}</button>
        </div>
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )

}

export default Step3a;
