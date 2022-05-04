import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../../translate";

const StudentDetailsNavbar = props => {

    const intervention = useSelector(state => state.intervention);
    const [navtab, setNavtab] = useState("");

    useEffect(() => {
        setNavtab("info");
    }, [props.studentId]);

  const navigateTo = gotab => {
    if (navtab !== gotab) {
        setNavtab(gotab);
    }
  };

  return (
    <span>
        <nav className="navbar navbar-intervention-settings navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
            <span id="settings-navbar-info" className={(navtab == "info") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("info");}}>
                {t("Info")}
            </span>
            <span id="settings-navbar-chat" className={(navtab == "chat") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("chat");}}>
                {t("Chat")}
            </span>
            <span id="settings-navbar-stress" className={(navtab == "stress") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("stress");}}>
                {t("Stress")}
            </span>
            <span id="settings-navbar-lessons" className={(navtab == "lessons") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("lessons");}}>
                {t("Info")}
            </span>
            <span id="settings-navbar-questionnaires" className={(navtab == "questionnaires") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("questionnaires");}}>
                {t("Questionnaires")}
            </span>
            <span id="settings-navbar-goals" className={(navtab == "goals") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("goals");}}>
                {t("Doelen")}
            </span>
            <span id="settings-navbar-log" className={(navtab == "log") ? "nav-item nav-link active" : "nav-item nav-link"}
                onClick={() => {navigateTo("log");}}>
                {t("Log")}
            </span>
            </div>
        </div>
        </nav>
        {dynamicContent}
    </span>
  );
};

export default StudentDetailsNavbar;
