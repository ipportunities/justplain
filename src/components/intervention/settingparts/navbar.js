import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import t from "../../translate";
import { useLocation } from "react-router-dom";
import {appSettings} from "../../../custom/settings";

const InterventionSettingsNavbar = props => {
  let location = useLocation();
  const intervention = useSelector(state => state.intervention);
  const history = useHistory();

  const [extraMenuItems, setExtraMenuItems] = useState([]);
  const [navtab, setNavtab] = useState("");
  const settingsType = location.pathname.split("/")[4];

  if(settingsType != navtab && typeof settingsType != "undefined"  && settingsType != "")
  {
    setNavtab(settingsType);
  }

  useEffect(() => {
    let tempExtraMenuItems = [];
    if(appSettings.translations){tempExtraMenuItems.push("translations")}
    if(appSettings.exam){tempExtraMenuItems.push("exam-types")}
    if(appSettings.gamification){tempExtraMenuItems.push("gamification")}
    if(tempExtraMenuItems.length > 0){tempExtraMenuItems.push("theme")}
    setExtraMenuItems(tempExtraMenuItems)
  }, [appSettings]);

  useEffect(() => {
    setNavtab("general");
  }, []);

  const navigateTo = gotab => {
    if (navtab !== gotab) {
      history.push("/intervention/edit/" + intervention.id + "/" + gotab + "/");
      setNavtab(gotab);
      props.showTab(gotab);
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav className="navbar navbar-intervention-settings navbar-expand-lg navbar-light bg-light">
      <div id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <span
            id="settings-navbar-general"
            className={
              navtab == "general"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("general");
            }}
          >
            {t("Algemeen")}
          </span>
          {intervention.settings.intervention_type != "chatcourse" ?
            <>
            <span
              id="settings-navbar-lessons"
              className={
                typeof intervention.settings.intervention_type != "undefined" &&
                intervention.settings.intervention_type !== "selfhelp" &&
                intervention.settings.intervention_type !== "guided_selfhelp"
                  ? "hidden"
                  : navtab === "lessons"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("lessons");
              }}
            >
              {t("Lessen")}
            </span>
            <span
              id="settings-navbar-optional-lessons"
              className={
                typeof intervention.settings.intervention_type != "undefined" &&
                intervention.settings.intervention_type !== "selfhelp" &&
                intervention.settings.intervention_type !== "guided_selfhelp"
                  ? "hidden"
                  : navtab === "optional-lessons"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("optional-lessons");
              }}
            >
              {t("Optionele lessen")}
            </span>
            </>
          :<></>}
          {intervention.settings.intervention_type == "chatcourse" ?
            <>
            <span
              id="settings-navbar-chatlessons"
              className={
                intervention.settings.intervention_type !== "chatcourse"
                  ? "hidden"
                  : navtab === "chatlessons"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("chatlessons");
              }}
            >
              {t("Chat lessen")}
            </span>
            <span
              id="settings-navbar-homework"
              className={
                intervention.settings.intervention_type !== "chatcourse"
                  ? "hidden"
                  : navtab === "homework"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("homework");
              }}
            >
              {t("Huiswerk")}
            </span>
            </>
          :<></>}


          <span
            id="settings-navbar-goals"
            className={ navtab === "goals"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("goals");
            }}
          >
            {t("Doelen")}
          </span>

          <span
            id="settings-navbar-questionnaires"
            className={
              navtab == "questionnaires"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            href="#"
            onClick={() => {
              navigateTo("questionnaires");
            }}
          >
            {t("Vragenlijsten")}
          </span>
          <span
            id="settings-navbar-pages"
            className={
              navtab == "pages"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            href="#"
            onClick={() => {
              navigateTo("pages");
            }}
          >
            {t("Pagina's")}
          </span>

          {extraMenuItems.length == 0 ?
            <span
              id="settings-navbar-theme"
              className={
                navtab == "theme"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              href="#"
              onClick={() => {
                navigateTo("theme");
              }}
            >
              {t("Thema")}
            </span>
            :<></>
          }
          {extraMenuItems.includes(navtab) ?
            <span
              className="nav-item nav-link active"
            >
              {navtab == "theme" ? t("Thema"):''}
              {navtab == "gamification" ? t("Gamification"):''}
              {navtab == "exam-types" ? t("Examens"):''}
              {navtab == "translations" ? t("Vertalingen"):''}
            </span>
            :<></>}
          <div className="extra_holder">
          {extraMenuItems.length > 1 ?
            <i className="fas fa-ellipsis-h"></i>
            :
            <></>
          }
          <div className="extra">
            {navtab != "theme" ?
              <span
                id="settings-navbar-theme"
                className="nav-item nav-link hidden"
                onClick={() => {
                  navigateTo("theme");
                }}
              >
                {t("Thema")}
              </span>
            :''}

            {appSettings.gamification && navtab != "gamification" ?
              <span
                id="settings-navbar-exam-types"
                className={ `nav-item nav-link ${ navtab === 'gamification' ? 'active' : '' }` }
                onClick={ () => {
                  navigateTo('gamification')
                } }>
                { t('Gamification') }
              </span>
            :false}
            {appSettings.exam && navtab != "exam-types" ?
              <span
                id="settings-navbar-exam-types"
                className={ `nav-item nav-link ${ navtab === 'exam-types' ? 'active' : '' }` }
                onClick={ () => {
                  navigateTo('exam-types')
                } }>
                { t('Examens') }
              </span>
            :false}
            {appSettings.translations && navtab != "translations" ?
              <span
              id="settings-navbar-translations"
              className={
                navtab == "translations"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              href="#"
              onClick={() => {
                navigateTo("translations");
              }}
            >
              {t("Vertalingen")}
            </span>
            :false}
          </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InterventionSettingsNavbar;
