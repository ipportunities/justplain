import React, { useState, useEffect } from 'react';

const Step1 = ({ac, dtc, sinaiDeelnemer, setStep}) => {

  const [akkoordVoorwaarden, setAkkoordVoorwaarden] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const nextStep = () => {
    setErrorMessage('')
    if (akkoordVoorwaarden) {
      if (sinaiDeelnemer) {
        setStep(3)
      } else {
        setStep(2)
      }
    } else {
      setErrorMessage("Je kunt alleen verder met de registratie indien je de informatie op deze pagina hebt gelezen en hiermee akkoord bent. Is dit het geval klik dan hierboven op de checkbox.")
    }
  }

  const clickAkkoordVoorwaarden = () => {
    setErrorMessage('')
    setAkkoordVoorwaarden(!akkoordVoorwaarden)
  }

  return(
    <div className="step1 step">
      <h1>Registratie stap 1</h1>
        <div className="container lessoncontent front">
      {
        sinaiDeelnemer ?
          <>
            <p>Welkom,<br />
            Goed dat je gaat meedoen aan KopOpOuders Zelfhulp! <br />
            Je start met het invullen van enkele vragen. <br />
            Daarna kun je aan de slag met de eerste module. <br />
            Veel succes!<br />
            </p>
          </>
          :
          <>
            <p>Welkom, <br />
            Goed dat je gaat meedoen aan KopOpOuders Zelfhulp! <br />
            Je start hierna met het invullen van een vragenlijst. <br />
            Daarna kun je aan de slag met de eerste module. <br />
            Veel succes!<br />
            </p>
          </>
      }


      <br /><br />
      <input
        className="form-check-input"
        type="checkbox"
        id="akkoordVoorwaarden"
        onChange={() => clickAkkoordVoorwaarden()}
        checked={akkoordVoorwaarden}
      />
      <label className="form-check-label" htmlFor="akkoordVoorwaarden">
      Ik geef toestemming om mijn gegevens te verwerken en heb in de <a href="https://www.kopopouders.nl/site/Privacy%20statement/" target="_blank">privacyverklaring</a> gelezen wat 'Kopopouders' wel en niet met mijn gegevens doet. *
      </label>
      {
        errorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div> : <></>
      }
      <div className="navigation">
        <button type="button" className="btn btn-primary next" onClick={() => nextStep()}>Doorgaan</button>
      </div>
      </div>
    </div>
  )

}

export default Step1;
