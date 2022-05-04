import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import t from "../translate";
import apiCall from "../api";
import NavBar from "../navBar";
import { setUiTranslation } from "../../actions";

const ResetPassword = (props) => {

  const location = useLocation();
  const dispatch = useDispatch();

  const [pwrc, setPwrc] = useState('');
  const [dtc, setDtc] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [resetFinished, setResetFinished] = useState(false);
  const [language_id, setLanguageId] = useState(1); //default dutch

  const resetErrors = {
    1: {
      1: "De url die je gebruikt is niet langer geldig.",
      2: "The url you use is no longer valid.",
    },
    2: {
      1: "Het opgegeven wachtwoord is niet sterk genoeg. Combineer kleine- en hoofdletters, cijfers en vreemde tekens.",
      2: "The specified password is not strong enough. Combine upper and lower case letters, numbers and strange characters.",
    },
    3: {
      1: "De opgegeven wachtwoorden zijn niet gelijk aan elkaar!",
      2: "The specified passwords are not the same!",
    },
  }

  useEffect(() => {
    if (location.pathname === '/resetpassword/')
    {
      if (location.search.substr(0,1) === '?')
      {
        let par = location.search.substr(1).split("&");
        if (par.length > 1)
        {
          let local_dtc = par[0].split("=")[1];
          let local_pwrc = par[1].split("=")[1];
          apiCall({
            action: "check_password_reset",
            data: {
              dtc: local_dtc,
              pwrc: local_pwrc
            }
          }).then(resp => {
            if (!resp.check)
            {
              setShowForm(false);
            }
            else
            {
              setLanguageId(resp.language_id);
              dispatch(setUiTranslation(resp.language_id));
              setDtc(local_dtc);
              setPwrc(local_pwrc);
            }
          });
        }
        else
        {
          setShowForm(false);
        }
      }
      else
      {
        setShowForm(false);
      }
    }
  },[location])

  const onSubmit = e => {
    e.preventDefault();
    setError(false)

    apiCall({
      action: "reset_password",
      data: {
        pwrc,
        dtc,
        password: password,
        passwordRepeat: passwordRepeat,
      }
    }).then(resp => {
      if (resp.reset === true)
      {
        setResetFinished(true);
        setShowForm(false);
      }
      else
      {
        setError(resetErrors[resp.msg][language_id]);
      }
    });
  };

  return (
    <>
    {
    showForm ?
      <>
        <div className="loginScreen reset_pw">
        <NavBar />
          <div
            id="loginContainer"
            className="mb-5 bg-white"
          >
            <form
              className={"reset"}
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
              <h3>{t("Reset wachtwoord")}</h3>
              <br />
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  aria-describedby="password"
                  placeholder={t("Wachtwoord")}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="passwordRepeat"
                  aria-describedby="passwordRepeat"
                  placeholder={t("Herhaal wachtwoord")}
                  value={passwordRepeat}
                  onChange={e => setPasswordRepeat(e.target.value)}
                />
              </div>
              <br />
              <div className="alignRight">
                <a className="forgotPassword btn" href="/">{t('Inloggen')}</a>
                <button type="submit" className="btn btn-primary">
                  {t("Reset wachtwoord")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    :
      <>
      {
      resetFinished ?
      <div>
        <div className="loginScreen is_reset">
        <NavBar />
          <div
            id="loginContainer"
            className="mb-5 bg-white"
          >
            <h3>{t("Reset wachtwoord")}</h3>
            <br />
            <p>
              {t("Je wachtwoord is opnieuw ingesteld. Klik ")}
              <a href="/">{t("hier")}</a> {t("om in te loggen.")}
              <br/>
              <br/>
              <a href="/" className="btn btn-primary">
                {t("Inloggen")}
              </a>
            </p>
          </div>
        </div>
      </div>
      :
      <div>


        <div className="loginScreen reset">
        <NavBar />
          <div
            id="loginContainer"
            className="mb-5 bg-white"
            >
            <h3>{t("Reset wachtwoord")}</h3>
            <br />
            <p>{t("De opgegeven url is niet langer geldig.")}</p>
            <br/>
            <a className=" btn btn-primary" href="/">{t('Terug')}</a>
            </div>
          </div>
        </div>
      }
      </>
    }
    </>
  )
}

export default ResetPassword
