import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from 'react-router-dom';
import { Cookies, useCookies } from 'react-cookie';
import Header from './panels/header';
import Footer from './panels/footer';
import RegistrationStep1 from './panels/step1';
import RegistrationStep2 from './panels/step2';
import RegistrationStep3 from './panels/step3';
import RegistrationStep4 from './panels/step4';
import RegistrationStep5 from './panels/step5';
import RegistrationStep6 from './panels/step6';
import RegistrationStep3a from './panels/step3a';
import apiCall from '../api';
import $ from "jquery";
import { setUiTranslation } from '../../actions';

const Registration = () => {

  const history = useHistory();
  let location = useLocation();
  const dispatch = useDispatch();

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  const [language, setLanguage] = useState(1); //dutch
  const language_id = useSelector(state => state.uiTranslation.language_id);
  const [langCode, setLangCode] = useState("nl"); //dutch
  const [intervention_id, setInterventionId] = useState(0); //inschrijven voor welke interventie?
  const [step, setStep] = useState(null); //stap in registratieproces
  const [qualtrics_id, setQualtricsId] = useState("");
  const [token, setToken] = useState("");
  const [popupShown, setPopupShown] = useState(0);

  const [registrationData, setRegistrationData] = useState({
    agree: false,
    followUp: false,
    email: '',
    gender: '',
    age: '',
    nationality: '',
    university: '',
    faculty: '',
    qualtricsLongerThen1WeekAgo: null,
  })

  const popupText = {
    1: "De nederlandse tekst vd popup...",
    2: "De engelse tekst van de popup"
  }

  const T0_questionnaires = {
    14: 126, //Moodpep
    24: 135, //StressLess
  }

  const parallax = () => {
    //$(".parallax").css({"transform":"translate3d(0px, "+(240 + $(document).scrollTop())+"px, 0px)"})
  }

  useEffect(() => {


    let querystring = location.pathname.split("/");

    if(querystring[4] == "en") {
      setLangCode("en")
      changeLanguage(2)
    }

    ////parallax init
    window.addEventListener('scroll', parallax);

    //i.g.v. reload evt registrationData ophalen
    if (cookies.hasOwnProperty("token"))
    {
      apiCall({
        action: "get_registration_data",
        data: {
          token: cookies.token
        }
      }).then(resp => {
        setRegistrationData(resp.registrationData);
        setStep(parseInt(resp.registrationData.step));
      });
    }
  }, [])

  useEffect(() => {
    let querystring = location.pathname.split("/");

    if (typeof querystring[0] !== 'undefined' && !isNaN((parseInt(querystring[0]))) && (parseInt(querystring[0]) < 8 || parseInt(querystring[0]) == 99))
    {
      /// als deze enkel gezet wordt indien niet gezet dan lijkt het goed te gaan... indien altijd dan komt de loop: Maar nu heeft de backbutton geen effect meer.....
      if(step !== parseInt(querystring[0])) {

        let newStep = parseInt(querystring[0]);
        //tbv reload na afronden aanmelding...
        if (newStep > 2 && !cookies.hasOwnProperty("token"))
        {
          newStep = 1;
        }
        /// ik kom bij een reload soms bij stap 1?
        if(newStep == 0){newStep = 1}
        setStep(newStep);
      }
      //
      if (typeof querystring[1] !== 'undefined' && !isNaN((parseInt(querystring[1]))))
      {
        setInterventionId(parseInt(querystring[1]));
      }
      //cookies???
      if (cookies.hasOwnProperty("qualtrics"))
      {
        setQualtricsId(cookies.qualtrics);
      }
      //cookies???
      if (cookies.hasOwnProperty("token"))
      {
        setToken(cookies.token);
      }
      //onvoldoende info??
      if (step > 2 && (intervention_id === 0 || token.length === 0))
      {
        setStep(1);
      }
    }
    else
    {
      if (typeof location.search !== 'undefined' && location.search.substr(0,4) === '?id=')
      {
        //qualtrics id... registreren
        apiCall({
          action: "register_qualtrics_id",
          data: {
            qualtrics_id:location.search.substr(4)
          }
        }).then(resp => {
          setQualtricsId(location.search.substr(4));
          //cookie zetten met qualtrics id, is 24 uur geldig tbv reload
          let now = new Date();
          let time = now.getTime();
          let expireTime = time + 1000*3600*24;
          now.setTime(expireTime);
          setCookie('qualtrics', location.search.substr(4), { path: '/registration/', expires: now });
          setStep(1);
        });
      }
      else
      {
        setStep(1);
      }
    }
  }, [location.pathname])

  useEffect(() => {

    /// deze moet niet afgaan bij een harde reload maar ook nog niet als er geen langCode gezet is
    /// nog steeds issues bij harde reload
    if (step !== null && langCode != false)
    {
      if(window.location.pathname != "/registration/"+step+"/"+intervention_id + "/" + langCode)
      {
        history.push("/registration/"+step+"/"+intervention_id + "/" + langCode);
      }
    }
  }, [step, langCode])


  const changeLanguage = (language_id) => {
    setLanguage(language_id);

    // de taal code wordt volgens mij nu niet meegegeven maar voor reload is het wel fijn om de gekozen taal uit de url te kunnen leiden
    let langCodeToSet = "nl"
    if(language_id == 2){
      langCodeToSet = "en"
    }
    setLangCode(langCodeToSet)
    if (parseInt(language_id) === 1)
    {
      dispatch(setUiTranslation(1,[]));
    }
    else
    {
      //getTranslation
      apiCall({
        action: "get_ui_translation_strings_by_language",
        data: {
          language_id: language_id
        }
      }).then(resp => {
        dispatch(setUiTranslation(language_id, resp.translation));
      });
    }
  }

  const Step = (props) => {

    switch (props.step) {

      case 1:
        //keuze interventie + evt registratie qualtrics id in tabel qualtrics
        return <RegistrationStep1  language_id={language} changeLanguage={changeLanguage} setStep={setStep} setInterventionId={setInterventionId}  qualtrics_id={qualtrics_id} />
        break;
      case 2:
        //informed conscent + aanmaken record in tabel registration + id hiervan evt in qualtrics rec
        return <RegistrationStep2  language_id={language} intervention_id={intervention_id} qualtrics_id={qualtrics_id} registrationData={registrationData} setRegistrationData={setRegistrationData} setStep={setStep} setToken={setToken} step={step} language={language} changeLanguage={changeLanguage} />
        break;
      case 3:
        //gender + age vastleggen in registration rec
        return <RegistrationStep3  language_id={language} intervention_id={intervention_id} token={token}  registrationData={registrationData} setRegistrationData={setRegistrationData} qualtrics_id={qualtrics_id} setStep={setStep} language={language} changeLanguage={changeLanguage}  />
        break;
      case 99:
        //qualtrics -> vragen of deze afgelopen week is ingevuld, in dat geval
        return <RegistrationStep3a  language_id={language} intervention_id={intervention_id} token={token} registrationData={registrationData} setRegistrationData={setRegistrationData} qualtrics_id={qualtrics_id} setStep={setStep} language={language} changeLanguage={changeLanguage} />
        break;
      case 4:
        //T0 afnemen, resultaten vastleggen in questionnaire_result + t0_finished in regigistration record
        //na afronden worden scores berekend en bepaald of inclusie/exclusie -> included en t0_scores in registration record
        return <RegistrationStep4  language_id={language} intervention_id={intervention_id} token={token} qualtrics_id={qualtrics_id} T0_questionnaires={T0_questionnaires} setStep={setStep} language={language} changeLanguage={changeLanguage} />
        break;
      case 5:
        //keuze van een coach, indien maar 1, dan automatische registratie en door naar stap 6
        //keuze wordt vastgelegd in registration coach_chosen (user_id van coach)
        return <RegistrationStep5  language_id={language} intervention_id={intervention_id} token={token} registrationData={registrationData} qualtrics_id={qualtrics_id} T0_questionnaires={T0_questionnaires} setStep={setStep} language={language} changeLanguage={changeLanguage}  />
        break;
      case 6:
        //inclusie/exclusie bepalen obv resultaten T0
        return <RegistrationStep6  language_id={language} intervention_id={intervention_id} token={token} qualtrics_id={qualtrics_id} T0_questionnaires={T0_questionnaires} setStep={setStep} language={language} changeLanguage={changeLanguage} />
        break;
      default:
        return <></>
        break;
    }
  }

  const closePopup = () => {
    setPopupShown(2);
    $(".overlay").fadeOut();
  }

  return (
    <div className="registrationContainer">
        {step == 1 ?
          <Header language={language} step={step}/>
          :''}
        <Step step={step} language={language_id}/>

        {step == 1 ?
          <Footer language={language_id} changeLanguage={changeLanguage} />
          :''}

        <div className={popupShown === 1 ? 'popup' : 'hidden'}>
          <div className="close pointer" onClick={() => closePopup()}>X</div>
          {popupText[language]}
        </div>

    </div>
  )
}

export default Registration;
