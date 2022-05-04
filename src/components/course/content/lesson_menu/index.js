import React from "react";
import LessonMenuType2 from "./type_2";
import LessonMenu from "../lesson_menu.js";

const LessonMenuTypeSwitcher = (props) => {

  return (
    <>
      {props.type == 2 ? <LessonMenuType2/>:''}
      {props.type == 3 ?
        <>
          <LessonMenu />
        </>
        :''}
    </>
  )
}

export default LessonMenuTypeSwitcher;
