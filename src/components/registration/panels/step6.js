import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Cookies, useCookies } from 'react-cookie';
import apiCall from "../../api";
import { getClone, validatePhonenumber } from "../../utils";
import t from '../../translate';
import NotificationBox from "../../alert/notification";

const Step6 = (props) => {

  const dispatch = useDispatch();

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  const errorMessages = [
    {
      nl: 'Zowel je voor als achternaam zijn verplichte velden.',
      eng: 'Both your first and last name are required fields.',
    },
    {
      nl: 'Gebruikersnaam is een verplicht veld, deze ga je gebruiken om in te loggen op het programma.',
      eng: 'Username is a required field, you will use it to log in to the program.',
    },
    {
      nl: 'De door jouw gekozen gebruikersnaam is helaas al in gebruik, kies een andere.',
      eng: 'The username you have chosen is unfortunately already in use, choose another one.',
    },
    {
      nl: 'Wachtwoord is een verplicht veld, deze ga je gebruiken om in te loggen op het programma.',
      eng: 'Password is a required field, you will use it to log in to the program.',
    },
    {
      nl: 'Het opgegeven wachtwoord en wachtwoord ter controle komen niet overeen.',
      eng: 'The specified password and password for verification do not match.',
    },
    {
      nl: 'Het opgegeven wachtwoord is niet sterk genoeg. Combineer kleine en hoofdletters met cijfers en tekens.',
      eng: 'The specified password is not strong enough. Combine upper and lower case letters with numbers and signs.',
    }
    ,
    {
      nl: 'Geef aan of je je persoonlijke gegevens wilt delen met je coach of dat je anoniem wilt deelnemen.',
      eng: 'Indicate if you want to share your personal data with your coach or if you want to participate anonymously.',
    }
    ,
    {
      nl: 'Geef een geldig telefoonnummer op.',
      eng: 'Please enter a valid phone number.',
    }
  ]

  const [notificationOptions, setNotificationOptions] = useState({
    show: false,
    text: "",
    confirmText: t("Ok"),
  });

  const [accountData, setAccountData] = useState({
    firstname: '',
    insertion: '',
    lastname: '',
    anonymous: '',
    login: '',
    password: '',
    password_check: '',
    phonenumber: '', 
  })

  const [showRegistrationFinished, setShowRegistrationFinished] = useState(false);
  const finishRegistration = () => {

    apiCall({
      action: "update_registration",
      data: {
        token: props.token,
        firstname: accountData.firstname,
        insertion: accountData.insertion,
        lastname: accountData.lastname,
        anonymous: accountData.anonymous,
        language_id: props.language_id,
        login: accountData.login,
        password: accountData.password,
        password_check: accountData.password_check,
        phonenumber: accountData.phonenumber,
        step: 6
      }
    }).then(resp => {
      if (resp.registrationFinished)
      {
        setShowRegistrationFinished(true);
        removeCookie("token", { path: '/registration/' });
        removeCookie("qualtrics", { path: '/registration/' });
      }
      else
      {
        let errorMessage = "";

        if (props.language_id === 1)
        {
          errorMessage = errorMessages[parseInt(resp.msg)-1].nl;
        }
        else
        {
          errorMessage = errorMessages[parseInt(resp.msg)-1].eng;
        }

        setNotificationOptions({
          show: true,
          text: errorMessage,
          confirmText: t("Ok"),
        });
      }

    });

  }

  const onChange = (e) => {
    let newAccountData = getClone(accountData);
    newAccountData[e.target.name] = e.target.value;
    setAccountData(newAccountData);
  }

  return (
    <div className="step6">
      <button type="button" className={showRegistrationFinished ? 'hidden' : 'btn prev'} onClick={() => props.setStep(5)}>{t("Terug")}</button>
      {/*<LanguageSwitch changeLanguage={props.changeLanguage} language={props.language}/>*/}
      <div className="container">
        <div className="step">
          <b>{t("stap 6")}</b> {t("account aanmaken")}
        </div>
        <div className="content">
          <div className={showRegistrationFinished ? 'hidden' : ''}>
            <div className="intro">
              <h1>{t("Laatste stap: over jou")}</h1>

              <p>{t("Met deze informatie wordt een account voor je aangemaakt.")}</p>
            </div>
            <form>
              <div className="form-row align-items-center">
                <div className="col-auto col-40 form-label-group">

                  <input
                    type="text"
                    className="form-control"
                    id="firstname"
                    name="firstname"
                    aria-describedby="firstname"
                    placeholder=""
                    value={accountData.firstname}
                    onChange={onChange}
                  />
                  <label htmlFor="firstname">{t("Voornaam")}</label>
                </div>
                <div className="col-auto col-20 form-label-group">
                  <input
                    type="text"
                    className="form-control"
                    id="insertion"
                    name="insertion"
                    aria-describedby="insertion"
                    placeholder=""
                    value={accountData.insertion}
                    onChange={onChange}
                  />
                  <label htmlFor="insertion">{t("Tussenvoegsel")}</label>
                </div>
                <div className="col-auto col-40 form-label-group">
                  <input
                    type="text"
                    className="form-control"
                    id="lastname"
                    name="lastname"
                    aria-describedby="lastname"
                    placeholder=""
                    value={accountData.lastname}
                    onChange={onChange}
                  />
                  <label htmlFor="lastname">{t("Achternaam")}</label>
                </div>
              </div>
              <div className="form-row align-items-center ">
                <div className="col-50 form-label-group">
                  <input
                    type="text"
                    className="form-control"
                    id="login"
                    name="login"
                    aria-describedby="login"
                    placeholder=""
                    value={accountData.login}
                    onChange={onChange}
                  />
                  <label htmlFor="login">{t("Gebruikersnaam")}</label>
                </div>
                <div className="col-50 form-label-group">
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
                  <label htmlFor="login">{t("Telefoonnummer")}</label>
                </div>
              </div>
              
              <div className="form-row align-items-center ">
                <div className="col-50 form-label-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    aria-describedby="password"
                    placeholder=""
                    value={accountData.password}
                    onChange={onChange}
                  />
                  <label htmlFor="password">{t("Wachtwoord")}</label>
                </div>
                <div className="col-50 form-label-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password_check"
                    name="password_check"
                    aria-describedby="password_check"
                    placeholder=""
                    value={accountData.password_check}
                    onChange={onChange}
                  />
                  <label htmlFor="password_check">{t("Wachtwoord ter controle")}</label>
                </div>
              </div>
              
              <div className="form-row align-items-center ">
                
                <div className="col bigLabel">
                <div className="blokker">{t("Wil je dit programma anoniem volgen? (je coach kan dan je naam en gebruikersnaam niet zien)")}</div>
                  <input
                      type="radio"
                      className="form-control"
                      id="anonymous_1"
                      name="anonymous"
                      aria-describedby="gender"
                      value="1"
                      onChange={onChange}
                      checked={accountData.anonymous === '1'}
                      /> <label htmlFor="anonymous_1">{t("Ja")}</label>
                  <input
                    type="radio"
                    className="form-control"
                    id="anonymous_0"
                    name="anonymous"
                    aria-describedby="anonymous"
                    value="0"
                    onChange={onChange}
                    checked={accountData.anonymous === '0'}
                  /> <label htmlFor="anonymous_0">{t("Nee")}</label>
                  
                    
                </div>
              </div>
              <div className="button_holder">
                <button type="button" className="btn btn-primary" onClick={() => finishRegistration()}>{t("Helemaal klaar!")}</button>
              </div>

            </form>
          </div>

          <div className={showRegistrationFinished ? '' : 'hidden'}>
            <h1>{t("Je aanmelding is hiermee afgerond")}</h1>
            {t("Je ontvangt binnen enkele minuten een e-mail met je inloggegevens en een link waarmee je je account kunt activeren. Zodra je account is geactiveerd kun je inloggen op de cursus.")}
          </div>
        </div>
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )

}

export default Step6;
