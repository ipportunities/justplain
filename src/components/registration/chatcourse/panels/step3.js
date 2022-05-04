import React, { useEffect, useState } from 'react'
import { Cookies, useCookies } from 'react-cookie';
import t from '../../../translate'

const Step3 = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

  useEffect(() => {
    //removeCookie("token", { path: '/registration' });
  }, [])

  return(
    <div className="step4">
      <div className="container lessoncontent front">
        <div className="step">
          <b>{t("Aanmelding afgerond")}</b>
        </div>
        <p>{t("Bedankt voor je aanmelding. Je krijgt binnen enkele minuten een bevestiging via de email.")}</p>
        <p>{t("We nemen z.s.m. contact met je op.")}</p>
      </div>
    </div>
  )
}

export default Step3