import React from "react";
import $ from "jquery";
import { useLocation } from "react-router-dom";
//import ExtraMenu from './extra_menu.js';

const Hook = (props) =>{
  var dynamicContent = '';

  switch(props.type) {
    case "courses":
      $("main.e_learning").removeClass("in_lesson");
      $(".banner_zoeken").show().removeClass("disabled");
    break;
    case "goal":
    case "goal-edit":
    case "goals":
    case "journal":
    case "stress":
    case "chat":
    case "settings":
    case "more":
    case "page":
    case "lessons":
      $("main").removeClass("in_lesson");
      $(".banner_zoeken").addClass("disabled");
      break;
    case "optional-lesson":
    case "lesson":
      $(document).ready(function(){
        $("main.e_learning").addClass("in_lesson");
      })
      break;
  }

  return(
    dynamicContent
  )


}

export default Hook;
