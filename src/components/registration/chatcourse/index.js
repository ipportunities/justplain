import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useHistory, useLocation } from 'react-router-dom'
import { Cookies, useCookies } from 'react-cookie'
import Step1 from './panels/step1'
import Step2 from './panels/step2'
import Step3 from './panels/step3'
import apiCall from '../../api';

const Registration = () => {

  const intervention_id = 11; //Gripopjedip interventie
  const language_id = 1; //alleen NL
  const [cookies, setCookie, removeCookie] = useCookies(['cookie-name'])
  const [token, setToken] = useState(""); //registration token (DB: registration.token)
  const [step, setStep] = useState(null); //stap in registratieproces
  
  useState(() => {
    //i.g.v. reload evt registrationData ophalen
    if (cookies.hasOwnProperty("token")) {
      setToken(cookies.token)
      apiCall({
        action: "get_registration_chatcourse_step",
        data: {
          token: cookies.token
        }
      }).then(resp => {
        /* setRegistrationData(resp.registrationData); */
        setStep(parseInt(resp.step))
      });
    } else {
      setStep(1)
    }
  }, [])

  const Step = () => {
    switch (step) {
      case 1:
        return <Step1 token={token} setToken={setToken} setStep={setStep} intervention_id={intervention_id} language_id={language_id} />
      case 2:
        return <Step2 token={token} setStep={setStep} intervention_id={intervention_id} language_id={language_id} />
      case 3:
        return  <Step3 token={token} />
      default:
        return <></>
    }
  }

  return (
    <div className="registrationContainer">
    {
      <Step />
    }
    </div>
  )

}

export default Registration