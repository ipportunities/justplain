import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import t from "../../translate";
import { useLocation } from "react-router-dom";
import Saved from "../../intervention/saved";
import {appSettings} from "../../../custom/settings";

const DashboardCoachNavbar = props => {
  let location = useLocation();
  const intervention = useSelector(state => state.intervention);
  const history = useHistory();

  const [navtab, setNavtab] = useState("");
  const settingsType = location.pathname.split("/")[3];

  if(settingsType != navtab && typeof settingsType != "undefined"  && settingsType != "")
  {
    setNavtab(settingsType);
  }

  useEffect(() => {
    if(location.pathname.split("/")[3] != navtab){
      setNavtab(location.pathname.split("/")[3]);
    }
  }, [location]);

  const navigateTo = gotab => {
    history.push("/dashboard/" + intervention.id + "/" + gotab + "/");
    setNavtab(gotab);
    props.showTab(gotab);
    window.scrollTo(0, 0);
  };

  return (
    <nav className="">
      <Saved />
      <div id="navbarNavAltMarkup">
        <div className="navbar-nav">
          {intervention.settings.intervention_type == "chatcourse" ?
            <>
              <span
                id="settings-navbar-registrations"
                className={
                  navtab == "registrations"
                    ? "nav-item nav-link active"
                    : "nav-item nav-link"
                }
                onClick={() => {
                  navigateTo("registrations");
                }}>
              {t("Aanmeldingen")}
              </span>
            </>
              :
              <></>
            }
            <span
              id="settings-navbar-students"
              className={
                navtab == "students"
                  ? "nav-item nav-link active"
                  : "nav-item nav-link"
              }
              onClick={() => {
                navigateTo("students");
              }}
            >
              {t("Deelnemers")}
            </span>
            {intervention.settings.intervention_type == "chatcourse" ?
              <>
              <span
                id="settings-navbar-groups"
                className={
                  navtab == "groups"
                    ? "nav-item nav-link active"
                    : "nav-item nav-link"
                }
                onClick={() => {
                  navigateTo("groups");
                }}
              >
                {t("Groepen")}
                </span>
              <span
                id="settings-navbar-group-archive"
                className={
                  navtab == "group-archive"
                    ? "nav-item nav-link active"
                    : "nav-item nav-link"
                }
                onClick={() => {
                  navigateTo("group-archive");
                }}
              >
                {t("Groepen archief")}
                </span>
              <span
                id="settings-navbar-group-texts"
                className={
                  navtab == "texts"
                    ? "nav-item nav-link active"
                    : "nav-item nav-link"
                }
                onClick={() => {
                  navigateTo("texts");
                }}
              >
                {t("Teksten")}
                </span>
              <span
                id="settings-navbar-group-agenda"
                className={
                  navtab == "agenda"
                    ? "nav-item nav-link active"
                    : "nav-item nav-link"
                }
                onClick={() => {
                  navigateTo("agenda");
                }}
              >
                {t("Planning")}
                </span>
              </>
            :''}
        </div>
      </div>
    </nav>
  );
};

export default DashboardCoachNavbar;
