import React, { useState } from 'react';
import t from '../../translate';
import { useSelector } from "react-redux";

const Universities = (props) => {

  const url = useSelector(state => state.url);

  return (
    <div className="universities">
      <span>{t("Studenten van de volgende universiteiten kunnen de programma's volgen")}</span>
      {props.step == 2 ?
        <p>
          {t("Als je niet ingeschreven staat bij één van deze universiteiten maar alsnog behoefte hebt aan hulp, neem dan contact op met je huisarts, studentenpsycholoog van je school, of iemand anders die je vertrouwt.")}
        </p>
        :''}
      <div className="logos">
        <div style={{backgroundImage:'url('+url+'/images/logos/leiden.png)'}}/>
        <div style={{backgroundImage:'url('+url+'/images/logos/maastricht.png)'}}/>
        <div style={{backgroundImage:'url('+url+'/images/logos/uu.png)'}}/>
        <div style={{backgroundImage:'url('+url+'/images/logos/vu.png)'}}/>
      </div>
    </div>
  )
}

export default Universities
