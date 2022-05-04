import React, { useState, useEffect } from 'react';
import apiCall from "../../api";
import t from '../../translate';
import {text, getText} from './text/';
import {validateEmail} from '../../utils';
import Universities from "./universities.js";

const Step1 = (props) => {

  const [interventions, setInterventions] = useState([]);
  const [noInterventions, setNoInterventions] = useState(false);
  const [interestedMoodpep, setInterestedMoodpep] = useState(false);
  const [interestedStress, setInterestedStress] = useState(false);
  const [interestedGetStarted, setInterestedGetStarted] = useState(false);
  const [interestedOplossingShop, setInterestedOplossingShop] = useState(false);
  const [email, setEmail] = useState("");
  const [addedToWaitinglist, setAddedToWaitinglist] = useState(false);

  const qualtricstext = [
    {
      1: "Heb je de Caring Universities Survey al gedaan?",
      2: "Have you already taken the Caring Universities Survey?"
    },
    {
      1: "Met deze online vragenlijst creëer je tijd voor zelfreflectie en krijg je een korte terugkoppeling met persoonlijk advies. Studenten van de VU, Universiteit Maastricht, Universiteit Utrecht en Universiteit Leiden hebben op 7 januari een link ontvangen in hun studentenemail. Check je inbox (of spamfolder) en klik op de link naar de vragenlijst!",
      2: "This online questionnaire gives you time to reflect on your own mental wellbeing and offers short feedback with personalized advice. Students of the VU, Maastricht University, Utrecht University and Leiden University received a link on January 7th in their student email. Check your inbox (or spam folder) and click on the link to the questionnaire!",
    },
    {
      1: "Doe de Check",
      2: "Do the Check"
    }
  ];

  const languagetext = [
    {
      1: "If you prefer to follow the programme in English, click here.",
      2: "Als je het programma in het Nederlands wilt doen, klik dan hier."
    }
  ]
  
  useEffect(() => {
    
    if (interventions.length < 1 && noInterventions === false)
    {
      apiCall({
        action: "get_registrationable_interventions",
        data: {
          language_id: props.language_id
        }
      }).then(resp => {
        setInterventions(resp.interventions);
        if (resp.interventions.length < 1)
        {
          //er zijn geen cursussen waarvoor men zich in kan schrijven...
          setNoInterventions(true);
        }
      });
    }
  }, [])

  const changeInterest = (e) => {
    if (e.target.name === 'interested_moodpep')
    {
      setInterestedMoodpep(!interestedMoodpep);
    }
    if (e.target.name === 'interested_stress')
    {
      setInterestedStress(!interestedStress);
    }
    if (e.target.name === 'interested_getstarted')
    {
      setInterestedGetStarted(!interestedGetStarted);
    }
    if (e.target.name === 'interested_oplossingshop')
    {
      setInterestedOplossingShop(!interestedOplossingShop);
    }
    
  }
  const changeEmail = (e) => {
    setEmail(e.target.value);
  }
  const sendWaitinglist = () => {

    let interestedin = '';

    if (!interestedMoodpep && !interestedMoodpep)
    {
      alert(t("Geef aan naar welk programma je interesse uit gaat."));
      return false;
    }
    else
    {
      if (interestedMoodpep) { interestedin += 'Moodpep '; }
      if (interestedStress) { interestedin += 'StressLess '; }
      if (interestedGetStarted) { interestedin += 'Getstarted '; }
      if (interestedOplossingShop) { interestedin += 'Oplossingshop '; }
    }
    if (!validateEmail(email))
    {
      alert(t("Geef een juist e-mailadres op!"));
      return false;
    }

    apiCall({
      action: "add_waitinglist",
      data: {
        interestedin,
        email
      }
    }).then(resp => {
      setAddedToWaitinglist(true);
    });

  }

  const goToStep2 = (intervention_id) => {
    props.setInterventionId(intervention_id);
    props.setStep(2);
    window.scrollTo(0, 0);
  }

  return (
    <div className="step1">
      <div className="container">
        <h2>{t("Caring Universities biedt momenteel de volgende programma's")}</h2>
        {t("Kies welk programma je graag zou willen volgen. Momenteel biedt Caring Universities haar programma's alleen aan (PhD) studenten aan in het kader van wetenschappelijk onderzoek. We willen met name graag onderzoeken hoe tevreden studenten zijn over de programma's. Voor meer informatie klik op Moodpep, Rel@x, GetStarted of OplossingShop.")}
        <br /><br />
        {
        props.qualtrics_id.length < 1 ?
            <div className="registration_waitinglist">
              <h2>{qualtricstext[0][props.language_id]}</h2>
              <p>{qualtricstext[1][props.language_id]}</p>
            </div>
            : <></>
        }
        <div className="languageswitch" onClick={() => props.changeLanguage(parseInt(props.language_id) === 1 ? 2 : 1)}>
          <i className="fas fa-exclamation-triangle"></i> &nbsp;
          {languagetext[0][props.language_id]}
        </div>
        {
          (!noInterventions) ?
            <>
              {/*
                <div className="step">
                  <b>{t("stap 1")}</b> {t("kies een programma")}
                </div>
              */}
              <div className="intervention_holder">
                {
                  interventions.map((intervention, index) => {
                    return (
                    <div className="intervention pointer" key={index} onClick={() => goToStep2(intervention.id)}>
                      <div className="image" style={{backgroundImage: "url('"+ intervention.image + "')"}}></div>
                      <h2>{intervention.title}</h2>
                      {t(getText(intervention.id, "description_short"))}
                      <div className="btn_holder">
                          <span className="btn red">
                            {t("Kies")}
                          </span>
                      </div>
                    </div>
                    )
                  })
                }
              </div>
            </>
            :
            <>
              <div className="registration_waitinglist">
                  {
                    (!addedToWaitinglist) ?
                    <>
                      <p>{t("Momenteel is er een wachtlijst voor het volgen van de programma's. Laat hier je emailadres achter zodat we je op de hoogte kunnen stellen als er weer plek is.")}</p>
                      <div className="registration_waitinglist_form">
                        <h2>{t("Schrijf je in voor de wachtlijst")}</h2>
                        {t("Ik heb interesse in")}
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="interested_moodpep"
                          name="interested_moodpep"
                          onChange={changeInterest}
                          checked={interestedMoodpep}
                        /> 
                        &nbsp; &nbsp; <label className="form-check-label" htmlFor="interested_moodpep">Moodpep</label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="interested_stress"
                          name="interested_stress"
                          onChange={changeInterest}
                          checked={interestedStress}
                        /> 
                        &nbsp; <label className="form-check-label" htmlFor="interested_stress">Rel@x</label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="interested_getstarted"
                          name="interested_getstarted"
                          onChange={changeInterest}
                          checked={interestedGetStarted}
                        /> 
                        &nbsp; <label className="form-check-label" htmlFor="interested_getstarted">GetStarted</label>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="interested_oplossingshop"
                          name="interested_oplossingshop"
                          onChange={changeInterest}
                          checked={interestedOplossingShop}
                        /> 
                        &nbsp; <label className="form-check-label" htmlFor="interested_oplossingshop">OplossingShop</label>
                       
                        <br />
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            aria-describedby="email"
                            placeholder={t("Jouw emailadres")}
                            value={email}
                            onChange={changeEmail}
                        />
                        <br />
                        <button type="button" className="btn btn-primary next" onClick={() => sendWaitinglist()}>{t("Verzend")}</button>

                      </div>
                    </> :
                    <>
                      {t("Je emailadres is toegevoegd aan de wachtlijst. Zodra je weer in kunt schrijven ontvang je bericht van ons!")}
                    </>
                  }
              </div>
            </>
        }
        {
          (parseInt(props.language_id) === 1) ?
            <div className="registration_boozebuster" onClick={()=> window.open("https://www.moodbuster.science/boozebuster/", "_blank")}>
                <h2>Boozebuster</h2>
                <p>Leer bewuster omgaan met alcohol, verbeter je stemming en slaap lekkerder. Let op, dit is een programma dat buiten Caring Universities aangeboden wordt.</p>
                <div className="btn_holder">
                    <span className="btn red">
                      {t("Kies")}
                    </span>
                </div>
            </div>
            :
            <></>
        }
        <Universities step={props.step}/>
      </div>
    </div>
  )

}

export default Step1;
