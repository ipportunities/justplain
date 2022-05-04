import React from "react";
import { useSelector } from "react-redux";
import Lessons from "./content/lessons.js";
import LessonsAltMenu from "./content/lessons_alt_menu.js";
import OptionalLesson from "./content/optional_lesson.js";
import Homework from "./content/homework.js";
import HomeworkOverview from "./content/homework_overview.js";
import Lesson from "./content/lesson.js";
import Goals from "./content/goals.js";
import Goal from "./content/goal.js";
import GoalFillOut from "../goal/fillOut.js";
import Journal from "./content/journal.js";
import Stress from "./content/stress.js";
import Chat from "./content/chat.js";
import LiveChat from "./content/live_chat.js";
import ChatArchive from "../groups/chat_archive.js";
import Overview from "../pages";
import Single from "../pages/single.js";
import Profile from "../profile";
import Hook from "../../custom/hook"; /// zodat we custom js kunnen inschieten ik heb dit nodig in mijnsalvage

const Content = (props) => {

  const activePart = useSelector(state => state.activePart);
  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth)


  const getContent = () => {
    let dynamicContent = "";

    switch (activePart) {
      case "lessons":
        if (typeof intervention.settings.selfhelp.alternative_menu === "undefined" || !intervention.settings.selfhelp.alternative_menu)
        {
          dynamicContent = <Lessons />
        }
        else
        {
          dynamicContent = <LessonsAltMenu />
        }
        break;
      case "optional-lesson":
        dynamicContent = <OptionalLesson />
        break;
      case "lesson":
        dynamicContent = <Lesson />
        break;
      case "goal":
        dynamicContent = <Goal />;
        break;
      case "goal-edit":
        dynamicContent = <GoalFillOut />;
        break;
      case "goals":
        dynamicContent = <Goals />;
        break;
      case "journal":
        dynamicContent = <Journal />;
        break;
      case "stress":
        dynamicContent = <Stress />;
        break;
      case "chat":
        dynamicContent = <Chat />;
        break;
      case "live-chat":
        dynamicContent = <LiveChat />;
        break;
      case "chatarchive":
        if(intervention.settings.intervention_type == "chatcourse"){
          let rights = auth.rights.interventions.find(int => parseInt(int.id) === parseInt(intervention.id))

          if(rights){
            let activeGroup = {id:rights.group_id}

            dynamicContent = <ChatArchive activeGroup={activeGroup}  chatActive={props.chatActive} setChatActive={props.setChatActive}/>;
          }

        }
        break;
      case "settings":
        dynamicContent = <Profile />;
        break;
      case "more":
        dynamicContent = <Overview />;
        break;
      case "page":
        dynamicContent = <Single />;
        break;
      case "my-homework":
        if(intervention.settings.intervention_type == "chatcourse"){
          dynamicContent = <HomeworkOverview chatActive={props.chatActive} setChatActive={props.setChatActive} />;
        }
        break;
      case "homework":
        if(intervention.settings.intervention_type == "chatcourse"){
          dynamicContent = <Homework />;
        }
        break;
    }

    return dynamicContent;
  }

  return (
    <div className="content">
      <Hook type={activePart}/>
      {getContent()}
    </div>
  )
}

export default Content;
