import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import QuestionnaireT0 from "../../questionnaires/T0";
import apiCall from "../../api";
import t from '../../translate';
import { setQuestionnaire, setAnswersLessons } from "../../../actions";
import standardAvatar from "../../../images/course/standard/avatar.png";
import LanguageSwitch from './languageSwitch';
import NotificationBox from "../../alert/notification";
import { Cookies, useCookies } from 'react-cookie';

const Step5 = (props) => {

  const dispatch = useDispatch();
  const [coaches, setCoaches] = useState([]);
  const [coachesAvailable, setCoachesAvailable] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [coachChosen, setCoachChosen] = useState(false);

  const url = useSelector(state => state.url);

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  const errorMessages = [
    {
      nl: 'Selecteer eerst een coach!',
      eng: 'Please select a coach first!',
    },
  ]

  useEffect(() => {

    apiCall({
      action: "get_available_coaches",
      data: {
        language_id: props.language_id,
        token: props.token,
        intervention_id: props.intervention_id
      }
    }).then(resp => {
      if (parseInt(resp.coachesAvailable) === 0)
      {
        setCoachesAvailable(false);
      }
      else
      {
        setCoaches(resp.coaches);
      }
      setLanguages(resp.languages)
    })
  }, [])

  useEffect(() => {
    if (coachChosen !== false)
    {
      registrateCoach();
    }
  }, [coachChosen])

  const [notificationOptions, setNotificationOptions] = useState({});

  const registrateCoach = () => {
    apiCall({
      action: "update_registration",
      data: {
        language_id: props.language_id,
        token: props.token,
        step: 5,
        nextStep: 6,
        coach_id: parseInt(coachChosen),
      }
    }).then(resp => {
      if(resp.noCoach){

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
      } else {
          props.setStep(6);
      }

    });

  }

  const getCoaches = () => {
    const content = [];
    coaches.map((coach, index) => {
      if(getBio(coach)){
        content.push(
          <div key={index} className={"coach pointer" + (coachChosen == coach.id ? ' active':'')} onClick={() => setCoachChosen(coach.id)}>
            <div className='image' style={{ backgroundImage: "url("+getImage(coach)+")" }}>
            </div>
            <h2>{coach.name}</h2><br />
            <div>{getBio(coach)}</div>
            <div className="btn_holder">
              <span className="btn red">
                {t('Kies')}
              </span>
            </div>
          </div>
        )
      }
    })

    return content
  }
  const getImage = (coach) => {
    if(coach.profile_pic == ""){
      return standardAvatar;
    } else {
      return url+"/uploads/user/"+ coach.id + "/" + coach.profile_pic
    }
  }
  const getBio = (coach) => {
    if(languages.length > 0){
      let this_language_obj = languages.filter(function (language) {
        return language.id == props.language_id
      });
      if(coach.languages.includes(this_language_obj[0].code)){
        if(this_language_obj[0].code == "nl"){
          return coach.bio
        } else {
          let this_bioTranslation_obj = coach.bioTranslations.filter(function (translation) {
            return translation.code == this_language_obj[0].code
          });
          if(this_bioTranslation_obj.length > 0){
            return coach.bioTranslations[coach.bioTranslations.indexOf(this_bioTranslation_obj[0])].content
          }
        }
      }
    }
  }

  const goStepBack = () => {
    if (cookies.hasOwnProperty("qualtrics"))
      {
        //qualtrics klant, mogelijk stap 4 over geslagen
        //sprint nov 2020: ook als men de qualtrics survey heeft ingevuld dan vult men alsnog de gehele T0 in.
        //dus panel 3a overslaan
        /* if (parseInt(props.registrationData.qualtricsLongerThen1WeekAgo) === 1)
        {
          props.setStep(4);
        }
        else
        {
          props.setStep(99);
        } */
        props.setStep(4);
      }
      else
      {
        props.setStep(4);
      }
  }

  return (
    <div className="step5">
      <button type="button" className="btn prev" onClick={goStepBack}>{t("Terug")}</button>
      {/*<LanguageSwitch changeLanguage={props.changeLanguage} language={props.language}/>*/}
      <div className="container">
        <div className="step">
          <b>{t("stap 5")}</b> {t("keuze coach")}
        </div>
        <div className="text">
        {
          coaches.length > 0 ?
            <>
              <div className='maxWidth'>
                <h1>{t("Jouw online coach")}</h1>
                <p>{t("Alle Caring Universities programma's worden begeleid door e-coaches.")}
                {coaches.length > 1 ?
                  <span><br/>{t("Kies je coach")}</span>
                  :''}
                </p>
              </div>
              <div className="coach_holder clearfix">
                {
                  coaches.map((coach, index) => {

                      return(
                        <div key={index} className={"coach pointer" + (coachChosen == coach.id ? ' active':'')} onClick={() => setCoachChosen(coach.id)}>
                          <div className='image' style={{ backgroundImage: "url("+getImage(coach)+")" }}>
                          </div>
                          <h2>{coach.name}</h2><br />
                          <div>{getBio(coach)}</div>
                          <div className="btn_holder">
                            <span className="btn red">
                              {t('Kies')}
                            </span>
                          </div>
                        </div>
                      )

                  })
                }
              </div>
              <div className='maxWidth marginBottom'>
                <p>
                  {t("Jouw coach is er voor je als je vragen hebt of ergens mee zit. Ook zullen ze na elke stap in het programma kijken hoe het met je gaat.")}
                  <br/>
                  <br/>
                  {t("Alle coaches zijn goed getraind en zijn onder begeleiding van een klinisch psycholoog. Alle coaching gebeurt online en hier zijn geen kosten aan verbonden.")}
                </p>
              </div>
              <span className="btn btn-primary" onClick={registrateCoach}>
                {t("Doorgaan")}
              </span>
            </>
          :
            <>
            {t("Er zijn op dit moment helaas geen coaches vrij. Je kunt daardoor je aanmelding helaas niet afronden.")}
            </>
        }
      </div>
      </div>
      <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  )

}

export default Step5;
