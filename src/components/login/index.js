import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  login,
  setAuthenticatedNull,
  setAuthenticatedFalse,
  setGamification
} from "../../actions";
import { getCookie } from "../utils";
import apiCall from "../api";
import { getClone } from "../utils";
import NavBar from "../navBar";
import t from "../translate";
import { setUiTranslation } from "../../actions";
import ForgotPassword from "./forgotPassword";
import ResetPassword from "./resetPassword";
import { useLocation } from "react-router-dom";
import {appSettings} from "../../custom/settings";

const Login = () => {
  //localState
  let [localState, setLocalState] = useState({
    username: "",
    password: "",
  });
  let location = useLocation();

  //
  const auth = useSelector(state => state.auth);
  const gamification = useSelector(state => state.gamification);
  const [resetPassword, setResetPassword] = useState(false)
  const querystring = location.pathname.split("/");

  const dispatch = useDispatch();

  useEffect(() => {
    //// password reset request
    if(querystring[1] == 'resetpassword' && false !== querystring[2])
    {
      setResetPassword(true);
    }
    else
    {
      //history.push("/"); //terug naar base-url waarom?
      if (getCookie("token").length > 0 && auth.status === null) {
        //api aanroepen
        apiCall({
          action: "login_token",
          data: {
            token: getCookie("token")
          }
        }).then(resp => {
          if (resp) {
            if (resp.login_token === true) {

              //ui translation???
              if (resp.preferences != null && typeof resp.preferences.language_id !== 'undefined')
              {
                if (parseInt(resp.preferences.language_id) === 1)
                {
                  //dutch...
                  dispatch(setUiTranslation(1, []));
                }
                else
                {
                  dispatch(setUiTranslation(resp.preferences.language_id, resp.ui_translation));
                }
              }

              //token was ok, vastleggen in store
              dispatch(
                login(
                  resp.user_id,
                  resp.name,
                  resp.token,
                  resp.userType,
                  resp.rights,
                  resp.preferences,
                  resp.profile_pic,
                  resp.email,
                  resp.gender,
                  resp.education,
                  resp.date_time_birth,
                  resp.firstname,
                  resp.insertion,
                  resp.lastname,
                )
              );

            } else {
              //token niet meer geldig, cookie weggooien
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
          }
        });
      }
    }
  }, []);
  //renderCount++;

  /// nog vraagstuk email en gebruikersnaam <=> studenten niet inloggen met email? anders theoretisch meerdere accounts mogelijk?
  const [showForgot, setShowForgot] = useState(false)

  const toggleForgotPassword = e => {
    setShowForgot(showForgot ? false:true)
  }

  const onChange = e => {
    e.preventDefault();

    //evt. melding foute inlog laten verdwijnen
    if (auth.status === false) {
      dispatch(setAuthenticatedNull());
    }
    //localstate up to date houden
    const dataObj = getClone(localState);
    dataObj[e.target.name] = e.target.value;
    setLocalState(dataObj);
  };

  const onSubmit = e => {
    e.preventDefault();

    //loginApi(localState.username, localState.password)
    apiCall({
      action: "login",
      data: {
        username: localState.username,
        password: localState.password
      }
    }).then(resp => {
      if (resp.login === true) {
        //inlog ok, token en usertype vastleggen in store

        //ui translation???
        if (resp.preferences != null && typeof resp.preferences.language_id !== 'undefined')
        {
          if (parseInt(resp.preferences.language_id) === 1)
          {
            //dutch...
            dispatch(setUiTranslation(1, []));
          }
          else
          {
            dispatch(setUiTranslation(resp.preferences.language_id, resp.ui_translation));
          }
        }

        dispatch(
          login(
            resp.user_id,
            resp.name,
            resp.token,
            resp.userType,
            resp.rights,
            resp.preferences,
            resp.profile_pic,
            resp.email,
            resp.gender,
            resp.education,
            resp.date_time_birth,
            resp.firstname,
            resp.insertion,
            resp.lastname,
          )
        );

        if(resp.userType == "student" && appSettings.gamification){
          gamification.login = true;
          dispatch(setGamification(gamification))
        }

        //token vastleggen in cookie
        document.cookie = "token=" + resp.token + "; path=/";
      } else {
        //localstate bijwerken
        const dataObj = getClone(localState);
        dataObj.username = "";
        dataObj.password = "";
        setLocalState(dataObj);
        //state.auth.status van null naar false
        dispatch(setAuthenticatedFalse());
      }
    });
  };

  return (
    <div className={"loginScreen" + (appSettings.included ? 'hide':'')}>
      <NavBar />

      <div>
        <div
          id="loginContainer"
          className="mb-5 bg-white"
        >
          {resetPassword ?
          <ResetPassword code={querystring[4]} setResetPassword={setResetPassword} />
            :
          <div>
            <form
              className={"login" + (showForgot ? ' hide':'')}
              onSubmit={e => {
                onSubmit(e);
              }}
            >
            <h3>{t("Inloggen")}</h3>
            <br />
            <div
              className={auth.status !== false ? "hidden" : "alert alert-danger"}
              role="alert"
            >
              <i className="fas fa-exclamation-circle"></i>{" "}
              {t("Authenticatie mislukt")}
            </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  aria-describedby="username"
                  placeholder={t("Gebruikersnaam")}
                  value={localState.username}
                  onChange={onChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  aria-describedby="password"
                  placeholder={t("Wachtwoord")}
                  value={localState.password}
                  onChange={onChange}
                />
              </div>

              <br />
              <table>
              <tbody>
                <tr>
                  <td>
                    <span className="forgotPassword btn" onClick={()=>toggleForgotPassword()}>{t('Wachtwoord vergeten')}</span>
                  </td>
                  <td>
                    <button type="submit" className="btn btn-primary">
                      {t("Inloggen")}
                    </button>
                  </td>
                </tr>
              </tbody>
              </table>

            </form>
              <ForgotPassword showForgot={showForgot} toggleForgotPassword={toggleForgotPassword}/>
          </div>
          }
        </div>

      </div>
    </div>
  );
};

export default Login;
