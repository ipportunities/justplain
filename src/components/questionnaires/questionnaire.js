import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from 'react-router-dom';
import Header from '../registration/panels/header';
import Footer from '../registration/panels/footer';
import QuestionnaireContent from './questionnaire_content';
import apiCall from '../api';
import { setQuestionnaire, setAnswersLessons, setUiTranslation } from "../../actions";
import t from '../translate';

const Confirmation = () => {

  const dispatch = useDispatch();
  const location = useLocation();


  const [ic, setIc] = useState('');
  const [dtc, setDtc] = useState('');
  const [weeknr, setWeeknr] = useState('');
  const [language_id, setLanguageId] = useState(1); //default dutch
  const [intervention_id, setInterventionId] = useState(0);
  const [questionnaire_id, setQuestionnaireId] = useState(0);


  const [showLoading, setShowLoading] = useState(true);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showWrongParams, setShowWrongParams] = useState(false);
  const [allreadyFinished, setShowAllreadyFinished] = useState(false);
  const [showFinished, setShowFinished] = useState(false);


  useEffect(() => {
    
    if (location.search.substr(0,1) === '?')
    {
      let par = location.search.substr(1).split("&");
      if (par.length > 1)
      {
        let invite_code = par[0].split("=")[1];
        let date_time_create = par[1].split("=")[1];

        setIc(invite_code);
        setDtc(date_time_create);

        apiCall({
          action: "get_questionnaire_on_invite",
          data: {
            ic: invite_code,
            dtc: date_time_create
          }
        }).then(resp => {
          if (parseInt(resp.questionnaireFound) === 0)
          {
            setShowLoading(false);
            setShowWrongParams(true);
          }
          else if (parseInt(resp.questionnaireFinished) === 1)
          {
            setShowLoading(false);
            setShowAllreadyFinished(true);
          }
          else
          {
            //questionnaire laden...
            setInterventionId(resp.intervention_id);
            setLanguageId(resp.language_id);
            setQuestionnaireId(resp.questionnaire_id);
            setWeeknr(resp.weeknr);

            if (parseInt(resp.language_id) !== 1)
            {
              dispatch(
                setUiTranslation(
                  resp.language_id,
                  resp.ui_translation)
              )
            }

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

            setShowLoading(false);
            setShowQuestionnaire(true);
          }
        });
      }
      else
      {
        setShowLoading(false);
        setShowWrongParams(true);
      }
    }
    else
    {
      setShowLoading(false);
      setShowWrongParams(true);
    }
    
  }, [location])

  const setFinished = () => {
    setShowQuestionnaire(false);
    setShowFinished(true);
  }
 
  return (

    <div className="questionnaireContainer">

      <Header loginbutton={false} />

      <div className="container lessoncontent front">

        <h1>{t("Vragenlijst")}</h1>

        <div className={showLoading ? '' : 'hidden'}>
          {t("De gegevens m.b.t. de vragenlijst worden opgehaald...")}
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>

        <div className={showWrongParams ? '' : 'hidden'}>
          {t("De vragenlijst kon helaas niet worden opgehaald.")}
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>

        <div className={allreadyFinished ? '' : 'hidden'}>
          {t("Je hebt deze vragenlijst al eerder ingevuld en afgerond.")}
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>

        <div className={showQuestionnaire ? '' : 'hidden'}>
          {
            showQuestionnaire ? 
              <QuestionnaireContent  intervention_id={intervention_id} language_id={language_id} questionnaire_id={questionnaire_id} weeknr={weeknr} ic={ic} dtc={dtc} setFinished={setFinished} />
              :
              <></>
          }
        </div>

        <div className={showFinished ? '' : 'hidden'}>
          {t("Hartelijk dank voor het invullen van de vragenlijst!")}
          <br /><br />
          Team Caring Universities
          <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>


      </div>

      <Footer language={0} />

    </div>
  )
}

export default Confirmation;