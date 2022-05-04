import React, { useState } from 'react';
import t from '../../../translate';
import {appSettings} from "../../../../custom/settings";

const Header = (props) => {

  return (
    <header>
      <img className="logo" src={appSettings.logo_white} />
      <a className={(typeof props.loginbutton !== 'undefined' && props.loginbutton === false) ? 'hidden' : 'btn btn-primary login'} href="/">{t("Log in")}</a>
      {props.step == 1 ?
        <div className="container">
          <div className="intro">
            <h1>Welkom bij de zelfhulpcursus van Kopopouders!</h1>
            <p>Algemene intro /registration/koozh/panels/header.js</p>
            <br/>
          </div>
        </div>
        :''}  
    </header>
  )
}

export default Header;
