import React, { useState } from 'react';
import t from '../../translate';
import {appSettings} from "../../../custom/settings";

const Header = (props) => {

  return (
    <header>
      <div className="parallax">
        <div className="inner">
        </div>
      </div>
      <img className="logo" src={appSettings.logo} />
      <a className={(typeof props.loginbutton !== 'undefined' && props.loginbutton === false) ? 'hidden' : 'btn login'} href="/">{t("Log in")}</a>
      <div className="container">
        {props.step == 1 ?
          <div className="intro">
            <h1>{t("Welkom op het Caring Universities platform!")}</h1>
            {t("Caring Universities biedt gratis online services om het mentaal welzijn van studenten te verbeteren. Alle programma's zijn evidence based, gecreëerd door klinisch psychologen, en bieden online coaching.")}
            <br/>
            <br/>
            {t("Bekijk de programma's hieronder, of lees meer over")} <a href="https://caring-universities.com/" target="_blank">Caring Universities</a>
          </div>
          :''}
      </div>
    </header>
  )
}

export default Header;
