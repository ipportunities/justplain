import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import t from "../translate";
import { setActiveTranslationTab } from "../../actions";
import { useHistory } from "react-router-dom";

const TranslationsNavbar = (props) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [navtab, setNavtab] = useState("");
  const [translation_id, setTranslationId] = useState(0);

  const activeTranslationTab = useSelector(state => state.activeTranslationTab);

  const changeTab = (tab) => {
    history.push("/translation/edit/" + translation_id + "/" + tab + "/");
    dispatch(setActiveTranslationTab(tab));

  }

  useEffect(() => {
    //translation_id
    if (props.translation_id > 0)
    {
      setTranslationId(props.translation_id);
    }
  }, [props])

  return (
    <nav className="navbar navbar-intervention-settings navbar-expand-lg navbar-light">
      <div id="navbarNavAltMarkup">
        <div className="navbar-nav">

          <span
            id="settings-navbar-general"
            className={
              activeTranslationTab == "title"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              changeTab("title");
            }}
          >
            {t("Algemeen")}
          </span>
          <span
            id="settings-navbar-general"
            className={
              activeTranslationTab == "lessons"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              changeTab("lessons");
            }}
          >
            {t("Lessen")}
          </span>

          <span
            id="settings-navbar-general"
            className={
              activeTranslationTab == "optional-lessons"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              changeTab("optional-lessons");
            }}
          >
            {t("Optionele lessen")}
          </span>

          <span
            id="settings-navbar-general"
            className={
              activeTranslationTab == "goals"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              changeTab("goals");
            }}
          >
            {t("Doelen")}
          </span>

          <span
            id="settings-navbar-general"
            className={
              activeTranslationTab == "questionnaires"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              changeTab("questionnaires");
            }}
          >
            {t("Vragenlijsten")}
          </span>

          <span
            id="settings-navbar-general"
            className={
              activeTranslationTab == "pages"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              changeTab("pages");
            }}
          >
            {t("Pagina's")}
          </span>
          {/*
            <span
              id="settings-navbar-general"
              className={
                activeTranslationTab == "ui"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                changeTab("ui");
              }}
            >
              {t("User interface")}
            </span>
          */}
        </div>
      </div>
    </nav>
  );
};

export default TranslationsNavbar;
