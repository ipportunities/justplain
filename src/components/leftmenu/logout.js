import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setAuthenticatedNull } from "../../actions";
import apiCall from "../api";
import t from "../translate";
import $ from "jquery";
import {appSettings} from "../../custom/settings";

const LogOut = () => {

  let history = useHistory();
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const onClickLogoff = e => {
    e.preventDefault();

    apiCall({
      action: "logoff",
      data: {
        token: auth.token
      }
    }).then(resp => {
      if (resp.logoff === true) {
        //logoff ok, token en usertype vastleggen in store
        dispatch(setAuthenticatedNull());
        //alle reducers resetten naar default state:
        dispatch({
          type: 'LOGOUT',
          payload: {}
        })
        //token niet meer geldig, cookie weggooien
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.getElementsByTagName('body')[0].classList.remove("menuIsVisible");
        if(appSettings.included){
          window.location = "/wp-login.php?action=logout";
        } else {
          history.push("/login");
        }

      } else {
        //??
      }
    });

    $(".overlay").fadeOut();
  };

  return(
    <div
      className="pointer"
      onClick={onClickLogoff}
    >
      <i className="fas fa-sign-out-alt"></i>
      <div className="menu-left-link">{t("Log uit")}</div>
    </div>
  )

}
export default LogOut;
