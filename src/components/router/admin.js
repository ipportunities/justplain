import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import NavBar from "../navBar";
import Dashboard from "../dashboard/admin";
import InterventionEdit from "../intervention/edit.js";
import TranslationEdit from "../translations/edit.js";
import InterventionCoaches from "../coaches/";
import InterventionStudents from "../students/";
import InterventionWaitinglist from "../waitinglist/";
import InterventionData from "../data/";
import EmailSettings from "../emailsettings/";
import Monitor from "../monitor/";
import Exam from '../exam'
import QuestionLibrary from '../questionlibrary'
//import Questionnaires from "../questionnaires";
import QuestionnaireEdit from "../questionnaires/edit.js";
//import Lessons from "../lessons";
import ChatlessonEdit from "../chatlessons/edit.js";
import HomeworkEdit from "../homework/edit.js";
import LessonEdit from "../lessons/edit.js";
import GoalEdit from "../goal/edit.js";
import PageEdit from "../pages/edit.js";
import LessonJson from "../lessons/json.js";
import {appSettings} from "../../custom/settings";
// import AsAdmin from "../dashboard/superuser/asadmin";
// import Users from "../users";
// import Organisations from "../organisations";

/// TODO om het interventieobject gelijk te krijgen in de verschillende edit bestanden moet die hier gezet worden anders kun je niet hard reloaden <= todo na 1 mei

const RouterAdmin = () => {
  const auth = useSelector(state => state.auth);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>

        <Route path="/exam">
          {
            (typeof auth.rights.config_access !== 'undefined' && auth.rights.config_access) ? <Exam /> : <Dashboard />
          }

        </Route>
        <Route path="/intervention/edit/:interventionId">
          {
            (typeof auth.rights.config_access !== 'undefined' && auth.rights.config_access) ? <InterventionEdit /> : <Dashboard />
          }
        </Route>
        <Route path="/intervention/coaches/">
          {
            (typeof auth.rights.config_access !== 'undefined' && auth.rights.coaches_access) ? <InterventionCoaches /> : <Dashboard />
          }
        </Route>
        <Route path="/intervention/students/">
          <InterventionStudents />
        </Route>
        <Route path="/intervention/waitinglist/">
          <InterventionWaitinglist />
        </Route>
        <Route path="/intervention/data/">
          {
            (typeof auth.rights.config_access !== 'undefined' && auth.rights.data_access) ? <InterventionData /> : <Dashboard />
          }
        </Route>
        {/*
          <Route path="/intervention/email-settings/">
            <EmailSettings />
          </Route>
          */}
        <Route path="/question-library">
          <QuestionLibrary />
        </Route>
        <Route path="/intervention/monitor/">
          <Monitor />
        </Route>
        {/*
          <Route path="/questionnaires/">
            <Questionnaires />
          </Route>
          <Route path="/lessons/">
            <Lessons />
          </Route>
        */}
        <Route path="/questionnaire/edit/">
          <QuestionnaireEdit action="edit" />
        </Route>
        <Route path="/questionnaire/edit-scores/">
          <QuestionnaireEdit action="editScores"/>
        </Route>

        <Route path="/goal/edit">
          <GoalEdit />
        </Route>

        <Route path="/page/edit">
          <PageEdit />
        </Route>

        <Route path="/lesson/edit">
          <LessonEdit />
        </Route>
        <Route path="/lesson/json">
          <LessonJson />
        </Route>



        <Route path="/translation/edit">
          <TranslationEdit />
        </Route>

        <Route path="/homework/edit">
          {appSettings.chatCourseAvailable ? <HomeworkEdit />:<Redirect to="/" />}
        </Route>

        <Route path="/chatlesson/edit">
          {appSettings.chatCourseAvailable ? <ChatlessonEdit />:<Redirect to="/" />}
        </Route>


        <Route path="*">
          <Redirect to="/" />
        </Route>


        {/* <Route path="/asAdmin" exact>
          <AsAdmin />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/organisations" exact>
          <Organisations />
        </Route> */}
      </Switch>
    </Router>
  );
};

export default RouterAdmin;
