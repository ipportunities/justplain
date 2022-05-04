import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StudentDetailsInfo from "./info.js";
import StudentDetailsChat from "./chat.js";
import StudentDetailsLiveChat from "./live_chat.js";
import StudentDetailsStress from "./stress.js";
import StudentDetailsJournal from "./journal.js";
import StudentDetailsLessons from "./lessons.js";
import StudentDetailsQuestionnaires from "./questionnaires.js";
import StudentDetailsGoals from "./goals.js";
import StudentDetailsLog from "./log.js";
import StudentDetailsRegistration from "./registration.js";
import StudentDetailsPlanContact from "./plan_contact.js";
import Homework from "./homework.js";
import Group from "./group.js";
import { StudentDetailsGeneratableExams } from './generatableExams'

const DynamicContent = (props) => {

    var dynamicContent = "";

    switch (props.dynamicContentType) {

        case "homework":
            dynamicContent = <Homework studentId={props.studentId} setUnseenLessonMain={props.setUnseenLessonMain}/>;
            break;
        case "group":
            dynamicContent = <Group studentId={props.studentId} user={props.user} setState={props.setState} state={props.state}/>;
            break;
        case "chat":
            dynamicContent = <StudentDetailsChat studentId={props.studentId} setUnreadMessage={props.setUnreadMessage} setUnreadMessageMain={props.setUnreadMessageMain} />;
            break;
        case "live-chat":
            dynamicContent = <StudentDetailsLiveChat studentId={props.studentId} setUnreadMessage={props.setUnreadMessage} setUnreadMessageMain={props.setUnreadMessageMain} />;
            break;
        case "stress":
            dynamicContent = <StudentDetailsStress studentId={props.studentId} />;
            break;
        case "journal":
            dynamicContent = <StudentDetailsJournal studentId={props.studentId} />;
            break;
        case "lessons":
            dynamicContent = <StudentDetailsLessons studentId={props.studentId} setUnseenLessonMain={props.setUnseenLessonMain} />;
            break;
        case "questionnaires":
            dynamicContent = <StudentDetailsQuestionnaires studentId={props.studentId} registration={props.user.registration} />;
            break;
        case "goals":
            dynamicContent = <StudentDetailsGoals studentId={props.studentId} />;
            break;
        case "log":
            dynamicContent = <StudentDetailsLog studentId={props.studentId} />;
            break;
        case "registration":
            dynamicContent = <StudentDetailsRegistration studentId={props.studentId} registration={props.user.registration}
            interventions={props.interventions} coaches={props.coaches}/>;
            break;
        case 'generatableExamTypes':
          dynamicContent = <StudentDetailsGeneratableExams studentId={ props.studentId } interventions={ props.interventions } coaches={ props.coaches } />
          break
        case 'info':
            dynamicContent = <StudentDetailsInfo studentId={props.studentId} user={props.user} />;
            break;
        case 'plan-contact':
            dynamicContent = <StudentDetailsPlanContact studentId={props.studentId} user={props.user} />;
            break;
    }

    return (
        <span>
            {(props.studentId === 0) ? <div /> : dynamicContent}
        </span>

    );

}

export default DynamicContent;
