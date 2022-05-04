import React, { useState } from 'react';
import t from '../../translate';
import LanguageSwitch from './languageSwitch';
import {appSettings} from "../../../custom/settings";

const Footer = (props) => {

  return (
    <div className="footer">
      <div className="container">
        <div className="title">Contact</div>
        <div className="row">
          <div className="column">
            Vrije Universiteit<br />
            Antwoordnummer 2941<br />
            2544, Sectie Klinische Psychologie<br />
            t.a.v. Sascha Struijs, kamer MF A518<br />
            1000 SN Amsterdam<br />
          </div>
          <div className="column">
              <a href="mailto:caring.universities@vu.nl">caring.universities@vu.nl</a><br />
              <a href="tel:+31 20 59 88 973">+31 20 59 88 973</a><br />
              <div className={parseInt(props.language) === 0 ? 'hidden' : 'languageSwitch'}>
                <span className={props.language === 1 ? 'active pointer' : 'pointer'} onClick={() => props.changeLanguage(1)}>Nederlands</span> | <span className={props.language === 2 ? 'active pointer' : 'pointer'} onClick={() => props.changeLanguage(2)}>English</span>
              </div>
          </div>
          <div className="column">
            <a href="https://caring-universities.com/info/">{t("Meer informatie")}</a><br />
            <a href="https://caring-universities.com/privacy-statement/">{t("Privacy Statement")}</a><br />
            &copy; Copyright Vrije Universiteit Amsterdam
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer;
