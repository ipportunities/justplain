import React from "react";
import t from "../translate";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAuthenticatedNull } from "../../actions";
import apiCall from "../api";
import $ from "jquery";
import {appSettings} from "../../custom/settings";

const Logout = (props) => {

  let history = useHistory();
  const auth = useSelector(state => state.auth);
  const url = useSelector(state => state.url);
  const dispatch = useDispatch();

  function logOut () {
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
        history.push("/");
        $('body').removeClass('menuIsVisible');
      } else {
        //??
      }
    });
  }

  return(
     <>
      {!appSettings.included ?
        <span onClick={()=>logOut()} className={"logout " + (typeof props.button != "undefined" && props.button == 'true' ? 'btn btn-primary':'')}>{t("log uit")}</span>
      :
        false
      }
    </>
  )

}

export default Logout
