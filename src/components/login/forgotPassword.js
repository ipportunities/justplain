import React, {useState} from "react";
import t from "../translate";
import apiCall from "../api";

const ForgotPassword = (props) => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const [showForm, setShowForm] = useState(true);



  const onSubmit = e => {
    e.preventDefault();
    setError(false)

    apiCall({
      action: "request_new_password",
      data: {
        email: email,
      }
    }).then(resp => {
      if (resp.send === true) {
        setShowForm(false);
      } else {
        setError(t("De opgegeven gebruikersnaam / e-mailadres is niet gekoppeld aan een account."));
      }
    });
  };

  return (
    <>
    {
    showForm ?
      <form
        className={"forgot"  + (!props.showForgot ? ' hide':'')}
        onSubmit={e => {
          onSubmit(e);
        }}
        >
        <div
          className={error == false ? "hidden" : "alert alert-danger"}
          role="alert"
        >
          <i className="fas fa-exclamation-circle"></i>{" "}
          {t(error)}
        </div>
        <h3>{t("Wachtwoord vergeten")}</h3>
        <br />
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            name="email"
            aria-describedby="email"
            placeholder={t("Gebruikersnaam of e-mailaddres")}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <br />
        <table>
          <tbody>
            <tr>
              <td>
                <span className="forgotPassword btn" onClick={()=>props.toggleForgotPassword()}>{t('Terug')}</span>
              </td>
              <td>
              <button type="submit" className="btn btn-primary">
                {t("Vraag aan")}
              </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      :
      <div>
        <h3 className="marge_bottom">{t("Wachtwoord vergeten")}</h3>
        <p>
          {t("Je ontvangt binnen enkele minuten een e-mail van ons waarmee je je wachtwoord opnieuw in kunt stellen.")}
        </p>
      </div>
      }
      </>
  )
}

export default ForgotPassword
