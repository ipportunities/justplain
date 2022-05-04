import React, { useState, useEffect } from 'react';
import apiCall from '../../../api';

const Step1 = ({ac, dtc, sinaiDeelnemer, setStep, setGetLastQuestionaire}) => {

  const [errorMessage, setErrorMessage] = useState('')
  const [registrationFinished, setRegistrationFinished] = useState(false)

  const [accountData, setAccountData] = useState({
    login: '',
    password: '',
    password_check: '',
    preferences: [{
      option: 'remindersType',
      value: ''
    }],
    phonenumber: '',
  })

  const previousStep = () => {
    if (sinaiDeelnemer) {
      setStep(1)
    } else {
      setStep(2)
      setGetLastQuestionaire(true)
    }
  }

  const onChange = (e) => {
    let newAccountData = {...accountData}
    if (e.target.name !== 'reminder_type') {
      newAccountData[e.target.name] = e.target.value
    } else {
      accountData.preferences[0].value = e.target.value
    }
    setAccountData(newAccountData)
  }

  const getReminderType = () => {
    return accountData.preferences[0].value
  }

  const finishRegistration = () => {
    setErrorMessage('')
    apiCall({
      action: "finish_registration_koozh",
      data: {
        ac,
        dtc,
        login: accountData.login,
        password: accountData.password,
        password_check: accountData.password_check,
        preferences: accountData.preferences,
        phonenumber: accountData.phonenumber,
      }
    }).then(resp => {
      if (resp.succes) {
        setRegistrationFinished(true)
      } else {
        setErrorMessage(resp.msg)
      }
    })
  }

   return(
    <div className="step6 step">

      {!registrationFinished ?
        <h1>Registratie stap {sinaiDeelnemer ? '2' : '3'}</h1>
        :<></>}
      <div className="container lessoncontent front">
        {
          registrationFinished ?
            <>
              <div className="registration_success">
                <h1>Je aanmelding is hiermee afgerond</h1>
                <p>Je ontvangt binnen enkele minuten een e-mail met je inloggegevens.<br />
                <br />Heb je de e-mail niet in je inbox ontvangen? Kijk bij je 'ongewenste e-mail' en stel daar zo nodig de status bij het bericht in als 'Geen ongewenste e-mail'.<br />
                <br />
                Om in te loggen klik <a href="/">hier</a></p>
              </div>
            </>
            :
            <>
              <div className="container">
              <div className="form-row align-items-center ">
                <div className='question'>Gebruikersnaam *</div>
                  <input
                    type="text"
                    className="form-control"
                    id="login"
                    name="login"
                    aria-describedby="login"
                    placeholder=""
                    value={accountData.login}
                    onChange={onChange}
                    autoCorrect="off"
                    autoCapitalize="none"
                  />

              </div>
              <div className='question'>Wachtwoord *</div>
              <div className="form-row align-items-center ">

                <div className="col-50 form-label-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    aria-describedby="password"
                    placeholder="Wachtwoord"
                    value={accountData.password}
                    onChange={onChange}
                    autoCorrect="off"
                    autoCapitalize="none"
                  />
                </div>
                <div className="col-50 form-label-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password_check"
                    name="password_check"
                    aria-describedby="password_check"
                    placeholder="Wachtwoord ter controle"
                    value={accountData.password_check}
                    onChange={onChange}
                    autoCorrect="off"
                    autoCapitalize="none"
                  />
                </div>
              </div>
              <div className='question'>
                Tijdens de cursus ontvang je herinneringen en extra tips.<br />
                Geef hier aan op welke wijze je graag herinneringen en tips wil ontvangen. *
              </div>
              <div className="form-row align-items-center bigLabel">
                <div className="col">
                  <input
                    type="radio"
                    className="form-control"
                    id="reminder_type_email"
                    name="reminder_type"
                    aria-describedby="reminder_type"
                    value="email"
                    onChange={(e) => onChange(e)}
                    checked={getReminderType() === 'email'}
                  /> <label htmlFor="reminder_type_email">Per E-mail</label>
                  <input
                    type="radio"
                    className="form-control"
                    id="reminder_type_sms"
                    name="reminder_type"
                    aria-describedby="reminder_type"
                    value="sms"
                    onChange={(e) => onChange(e)}
                    checked={getReminderType() === 'sms'}
                    /> <label htmlFor="reminder_type_sms">Per SMS</label>
                </div>
              </div>
              {
                  getReminderType() === 'sms' ?
                    <>
                      <div className='question'>
                        Telefoonnummer *
                      </div>
                      <div className="form-row align-items-center bigLabel">
                          <input
                            type="text"
                            className="form-control"
                            id="phonenumber"
                            name="phonenumber"
                            aria-describedby="phonenumber"
                            placeholder=""
                            value={accountData.phonenumber}
                            onChange={onChange}
                          />
                      </div>
                    </>
                    :
                    <></>
                }
              </div>
            </>
        }

      </div>

      {
        errorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert" dangerouslySetInnerHTML={{ __html: errorMessage}}></div> : <></>
      }

      {!registrationFinished ?
        <div className="navigation">
          <div className="prevHolder">
            <button type="button" className="btn prev" onClick={() => previousStep()}>Terug</button>
          </div>
          <button type="button" className="btn btn-primary next" onClick={() => finishRegistration()}>Afronden</button>
        </div>
        :<></>}



    </div>
  )

}

export default Step1;
