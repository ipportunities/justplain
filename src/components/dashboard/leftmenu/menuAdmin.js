import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import t from "../../translate";
import LogOut from "./logout";
import LanguageSwitch from "./languageswitch";
import $ from "jquery";
import { appSettings } from '../../../custom/settings'

const MenuAdmin = props => {
  let history = useHistory();

  let location = useLocation();

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
    window.scrollTo(0, 0);
  };

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  return (
    <div>
      <div className="pointer" onClick={event => handleClick(event, "/")}>
        <i className="fas fa-home"></i>
        <div className="menu-left-link">{t("Dashboard")}</div>
      </div>
      {appSettings.exam ?
        <div className="pointer" onClick={ event => handleClick(event, '/question-library') }>
          <i className="fas fa-question"/>
          <div className="menu-left-link">{ t('Vragen bibliotheek') }</div>
        </div>
        :''}
      {location.pathname != "/" ?
        <>
          <div
            className={
              typeof intervention.id !== undefined && intervention.id > 0
                ? ""
                : "hidden"
            }
          >
            <div
              className={auth.rights.config_access ? 'pointer' : 'hidden'}
              onClick={event =>
                handleClick(
                  event,
                  "/intervention/edit/" + intervention.id + "/general/"
                )
              }
            >
              <i className="fas fa-cog color_logo_orange"></i>
              <div className="menu-left-link">{t("Instellingen")}</div>
            </div>
            {typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type != "selfhelp" ?
              <div
                className={auth.rights.coaches_access ? 'pointer' : 'hidden'}
                onClick={event =>
                  handleClick(event, "/intervention/coaches/" + intervention.id)
                }
              >
                <i className="fas fa-users color_logo_blue"></i>
                <div className="menu-left-link">{t("Coaches")}</div>
              </div>
            :<></>}
            <div className='pointer' onClick={event =>handleClick(event, "/intervention/students/" + intervention.id)}>
              <i className="fas fa-users color_logo_orange"></i>
              <div className="menu-left-link">{t("Deelnemers")}</div>
            </div>
            { appSettings.exportData === true ?
              <div
                className={auth.rights.data_access ? 'pointer' : 'hidden'}
                onClick={event =>
                  handleClick(event, "/intervention/data/" + intervention.id)
                }
              >
                <i className="fas fa-table color_logo_orange"></i>
                <div className="menu-left-link">{t("Data")}</div>
              </div>
              :
              <></>
            }
            {
              /*
            <div
              className="pointer"
              onClick={event =>
                handleClick(event, "/intervention/monitor/")
              }
            >
              <i className="fas fa-chart-area color_logo_blue"></i>
              <div className="menu-left-link">{t("Monitor")}</div>
            </div>
            */}
            {appSettings.emailSettings == true ?
              <div className="pointer" onClick={ event => handleClick(event, '/intervention/email-settings/' + intervention.id) }>
                <i className="fas fa-table color_logo_blue"/>
                <div className="menu-left-link">{ t('Email settings') }</div>
              </div>
              :<></>
            }
          </div>
        </>
        :''}
      <LogOut />
      <LanguageSwitch />
    </div>
  );
};

export default MenuAdmin;
