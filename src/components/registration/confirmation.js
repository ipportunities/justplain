import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import Header from './panels/header';
import Footer from './panels/footer';
import apiCall from '../api';
import { setUiTranslation } from '../../actions';
import t from '../translate';
import { useLocation } from "react-router-dom";

const Confirmation = () => {

  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const [language, setLanguage] = useState(1); //dutch
  const language_id = useSelector(state => state.uiTranslation.language_id);
  const [showError, setShowError] = useState(false);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [allreadyConfirmed, setShowAllreadyConfirmed] = useState(false);
  /*
  apiCall({
        action: "get_registration_data",
        data: {
          token: cookies.token
        }
      }).then(resp => {
        setRegistrationData(resp.registrationData);
      });
      */

  useEffect(() => {
    let querystring = location.pathname.split("/");

    if (querystring[2].substr(0,1) === '?')
    {
      let par = querystring[2].substr(1).split("&");
      if (par.length > 1)
      {
        let ac = par[0].split("=")[1];
        let dtc = par[1].split("=")[1];
        apiCall({
          action: "update_registration",
          data: {
            step: 7,
            ac,
            dtc
          }
        }).then(resp => {
          if (parseInt(resp.accountConfirmed) === 1)
          {
            changeLanguage(parseInt(resp.language_id));
            setShowConfirmed(true);
          }
          else if (parseInt(resp.accountConfirmed) === 2)
          {
            setShowAllreadyConfirmed(true);
          }
          else
          {
            setShowError(true);
          }
        });

      }
      else
      {
        setShowError(true);
      }
    }
    else
    {
      setShowError(true);
    }


  }, [location.pathname])

  useEffect(() => {

  }, [language_id]);

  const changeLanguage = (language_id) => {
    if (language !== language_id)
    {
      setLanguage(language_id);
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
  }


  return (

    <div className="registrationContainer">

      <Header />

      <div className="confirmation">
        	<div className="container">

            <h1>{t("Accountactivatie")}</h1>

            <div className={showError ? '' : 'hidden'}>
              {t("Accounactivatie mislukt: de door jouw gebruikte link lijkt niet geldig...")}
            </div>

            <div className={showConfirmed ? '' : 'hidden'}>
              {t("Je account is geactiveerd. Je kunt nu inloggen en starten met het programma.")}
              <br /><br />
              <a href="/">{t("Klik hier om naar het inlogscherm te gaan.")}</a>
            </div>

            <div className={allreadyConfirmed ? '' : 'hidden'}>
              {t("Jouw account was al op een eerder moment geactiveerd.")}
              <br /><br />
              <a href="/">{t("Klik hier om naar het inlogscherm te gaan.")}</a>
            </div>

            <div className={(!showError && !showConfirmed && !allreadyConfirmed) ? '' : 'hidden'}>
              {t("Een moment, je account wordt op dit moment geactiveerd.")}
            </div>

          </div>
      </div>

      <Footer language={language_id} changeLanguage={changeLanguage} />

    </div>
  )
}

export default Confirmation;
