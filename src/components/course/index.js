import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorPage from "../error/";
import LoadScreen from "../loadScreen";
import { setActivePart, setActiveLesson, setActiveSubLesson, setActivePage, setActiveGoal, setGamification, setActiveHomework } from "../../actions";
import { useLocation } from 'react-router-dom'
import DashBoardLeft from "./content/dashboard_left.js";
import LeftMenu from "../dashboard/leftmenu";
import Content from "./content.js"; // er is ook een map content, daarom explicit .js
import {appSettings} from "../../custom/settings";
import {handlePoints} from "../gamification/functions";
import t from "../translate";
import apiCall from "../api";

const Course = (props) => {

  /// window location href fired niet na change via history.goBack() location.pathname wel
  let location = useLocation();

  const dispatch = useDispatch();

  const activePart = useSelector(state => state.activePart);
  const activeLesson = useSelector(state => state.activeLesson);
  const activeSubLesson = useSelector(state => state.activeSubLesson);
  const gamification = useSelector(state => state.gamification);
  const intervention = useSelector(state => state.intervention);

  const [chatActive, setChatActive] = useState(false);

  //TODO deze allowed kan er helamaal uit denk ik...
  let allowed = true;
  //bij wijzigen url uitlezen en juiste activePart vaststellen
  useEffect(() => {

    //// is er ergens nog een check of je de desbetreffende pagina wel mag zien... een ander id geeft een error in de les
    //i.g.v. reload wordt via de url vastgesteld of er een specifiek onderdeel geladen moet worden
    let querystring = location.pathname.split("/");

    let allowedParts = ["lessons", "lesson", "optional-lesson", "goals", "journal", "stress", "chat", "settings", "more", "page", "goal", "goal-edit", "my-homework", "homework", "chatlesson", "chatarchive", "live-chat"];
    if (querystring.length > 3 && querystring[3].length > 0 && activePart !== querystring[3] && allowedParts.indexOf(querystring[3]) > -1)
    {

      dispatch(setActivePart(querystring[3]));
      //igv lesson, activeLesson vastleggen
      if (querystring[3] === 'lesson' && querystring.length > 4 && querystring[4].length > 0 && activeLesson !== querystring[4] && !isNaN(querystring[4]))
      {
        dispatch(setActiveLesson(querystring[4]));
        //sublesson? Uitgeschakeld ivm routing...
        /*
        if (querystring.length > 7 && querystring[7].length > 0 && activeSubLesson !== querystring[7] && !isNaN(querystring[7]))
        {
          dispatch(setActiveSubLesson(querystring[7]));
        }
        */
      }
      //igv optionele les, activePage vastleggen
      if (querystring[3] === 'optional-lesson' && querystring.length > 4 && querystring[4].length > 0 && activeLesson !== querystring[4] && !isNaN(querystring[4]))
      {
        dispatch(setActiveLesson(querystring[4]));
      }
      //igv page, activePage vastleggen
      if (querystring[3] === 'page' && querystring.length > 4 && querystring[4].length > 0 && activeLesson !== querystring[4] && !isNaN(querystring[4]))
      {
        dispatch(setActivePage(querystring[4]));
      }
      //igv goal, activeGoal vastleggen
      if (querystring[3] === 'goal' && querystring.length > 4 && querystring[4].length > 0 && activeLesson !== querystring[4] && !isNaN(querystring[4]))
      {
        dispatch(setActiveGoal(querystring[4]));
      }
      //igv goal, activeGoal vastleggen
      if (querystring[3] === 'homework' && querystring.length > 4 && querystring[4].length > 0 && activeLesson !== querystring[4] && !isNaN(querystring[4]))
      {
        dispatch(setActiveHomework(querystring[4]));
      }

    }
      //// dankzijn location.pathname doet de back funtie in de mobiele chat het wel
  }, [location.pathname]);

  //bij wijzigen part naar top scherm scrollen
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePart, activeLesson, activeSubLesson]);


  ///gamification login action
  useEffect(() => {
    if(appSettings.gamification && intervention.id > 0 && gamification.login){
      gamification.points.interventions = handlePoints(gamification, intervention.id, "login", [intervention], t("Login"))
      gamification.login = false;
      dispatch(setGamification(gamification))
    }

    /// set active part if is not set
    if(intervention.id > 0 && location.pathname.split("/").length <= 3){
      if(intervention.settings.intervention_type == "chatcourse" && activePart != "my-homework"){
        dispatch(setActivePart("my-homework"));
      } else {
        dispatch(setActivePart("lessons"));
      }
    }
  }, [intervention]);

  return (
    <>
      <LeftMenu />
      {allowed ? (
        <div className={(activePart == 'lesson' || activePart == 'optional-lesson' || activePart == 'homework') ? 'dashboard lessoncontent front':"dashboard student " + activePart + ' intervention_' + intervention.id + (chatActive ? ' chatActive':'')}>
          <div className="clearfix holder">
            <DashBoardLeft />
            <div className="right">
              <Content setChatActive={setChatActive} chatActive={chatActive} />
            </div>
          </div>

        </div>
      ) : (
        <div>
          {allowed == "loading" ? (
            <div>
              <LoadScreen />
            </div>
          ) : (
            <div>
              <ErrorPage />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Course;
