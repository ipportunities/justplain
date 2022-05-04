import React, {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import t from "../../translate";
import LogOut from "./logout";
import LanguageSwitch from "./languageswitch";
import $ from "jquery";
import {appSettings} from "../../../custom/settings";

const MenuCoach = props => {
  let history = useHistory();

  const auth = useSelector(state => state.auth);
  let location = useLocation();
  const intervention = useSelector(state => state.intervention);
  const [supervisorFor, setSupervisorFor] = useState([]);

  useEffect(() => {
    //Van welke interventies is deze coach supervisor?
    let localSupervisorFor = [];
    auth.rights.interventions.forEach(function (interv, index) {
      if (interv.isSupervisor)
      {
        localSupervisorFor.push(interv.id);
      }
    });
    setSupervisorFor(localSupervisorFor);
  }, [])

  const handleClick = (event, redirectTo) => {
    $("#menu_left").animate(
      {
        marginRight: "-405px"
      },
      600
    );
    $('body').removeClass('menuIsVisible');
    $("#nav-icon-wrapper, #menu_left").removeClass("open");
    $(".overlay").fadeOut();
    history.push(redirectTo);
  };

  return (
    <div>
      <div
        className={auth.rights.interventions.length > 1 ? "pointer" : "hidden"}
        onClick={event => handleClick(event, "/")}
      >
        <i className="fas fa-home"></i>
        <div className="menu-left-link">{t("Dashboard")}</div>
      </div>
      {location.pathname != "/" ?
        <div
            className={(intervention.id !== 0 && supervisorFor.indexOf(intervention.id) > -1) ? 'pointer' : 'hidden'}
            onClick={event =>
              handleClick(event, "/intervention/coaches/" + intervention.id)
            }
          >
            <i className="fas fa-users color_orange"></i>
            <div className="menu-left-link">{t(appSettings.begeleiderNameMeervoud)}</div>
        </div>
        :
        false
      }
      {location.pathname != "/" ?
        <div
            className="pointer"
            onClick={event =>
              handleClick(event, "/students/" + intervention.id)
            }
          >
            <i className="fas fa-users color_orange"></i>
            <div className="menu-left-link">{t("Deelnemers")}</div>
        </div>
      :false}
      <LogOut />
      <LanguageSwitch />
    </div>
  );
};

export default MenuCoach;
