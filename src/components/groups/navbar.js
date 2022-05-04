import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import t from "../translate";
import { useLocation } from "react-router-dom";

const Navbar = props => {
  let location = useLocation();
  const intervention = useSelector(state => state.intervention);
  const history = useHistory();

  const navigateTo = gotab => {
    if (props.activeTab !== gotab) {
      if(props.type == "groups"){
        history.push("/dashboard/" + intervention.id + "/groups/" + props.activeGroup.id + "/" + gotab + "/");
      } else {
        history.push("/dashboard/" + intervention.id + "/group-archive/" + props.activeGroup.id + "/" + gotab + "/");
      }

      props.showTab(gotab);
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav className="navbar navbar-intervention-settings navbar-expand-lg navbar-light group">
      <div className="collapse navbar-collapse">
        <div className="navbar-nav">
          {props.type == "groups" ?
            <span
              id="settings-navbar-chat"
              className={
                props.activeTab == "chat"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("chat");
              }}>
              {t("Chatsessie starten")}
            </span>
          :<></>}
          <span
            id="settings-navbar-archive"
            className={
              props.activeTab == "archive"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("archive");
            }}>
            {t("Chat archief")}
          </span>
          <span
            id="settings-navbar-students"
            className={
              props.activeTab == "students"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("students");
            }}>
            {t("Deelnemers")}
          </span>
          <span
            id="settings-navbar-log"
            className={
              props.activeTab == "log"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("log");
            }}>
            {t("Logboek")}
          </span>
          {/*
            <span
              id="settings-navbar-sms"
              className={
                props.activeTab == "sms"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("sms");
              }}>
              {t("SMS groep")}
            </span>
            */}

          <span
            id="settings-navbar-message"
            className={
              props.activeTab == "message"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("message");
            }}>
            {t("Bericht groep")}
          </span>
          <span
            id="settings-navbar-agenda"
            className={
              props.activeTab == "agenda"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("agenda");
            }}>
            {t("Agenda")}
          </span>
          <span
            id="settings-navbar-settings"
            className={
              props.activeTab == "settings"
                ? "nav-item nav-link active"
                : "nav-item nav-link"
            }
            onClick={() => {
              navigateTo("settings");
            }}>
            {t("Settings")}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
