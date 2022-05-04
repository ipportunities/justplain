import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../../../translate";
import MenuItems from "../menu_items.js";
import { setActivePart, setActiveLesson, setActiveSubLesson } from "../../../../actions/index.js";
import {appSettings} from "../../../../custom/settings";

const LessonMenuType2 = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const activeLesson = useSelector(state => state.activeLesson);
  const activePart = useSelector(state => state.activePart);

  const [activeLessonTitle, setActiveLessonTitle] = useState('');

  useEffect(() => {
    if(intervention.id > 0){
      let lessonsToUse = intervention.settings.selfhelp.lessons

      if(activePart == "optional-lesson"){
        lessonsToUse = intervention.settings.selfhelp.optionalLessons
      }

      //lesson zoeken
      let lesson = lessonsToUse.find((lesson) => {
        return parseInt(lesson.id) === parseInt(activeLesson)
      });

      setActiveLessonTitle(lesson.title)
    }

  }, [activeLessonTitle, intervention]);

  const load = (part = "lessons") => {
    dispatch(setActiveLesson(0));
    dispatch(setActiveSubLesson(0));
    dispatch(setActivePart(part));
    history.push("/course/" + intervention.id + '/' + part);
  }

  return (
    <>
      <img src={appSettings.logo} className="logo"/>
      <span className="btn btn-primary back" onClick={()=>load()}>{t("Overzicht " + appSettings.interventieName.toLowerCase())}</span>
      <div className="intervention">
        {intervention.title}
      </div>
      <div className="lesson">
        {activeLessonTitle}
      </div>
      <MenuItems/>
    </>
  )
}

export default LessonMenuType2;
