import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import NavBar from "../../navBar";
import Dashboard from "../../dashboard/superuser";
import Users from "../admins";
import UserEdit from "../admins/userEdit";
import Organisations from "../organisations";
import UiTranslations from "../uitranslations";
import UiTranslation from "../uitranslations/edit.js";

const RouterSuperUser = () => {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <Dashboard />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/users/add" exact>
          <UserEdit />
        </Route>
        <Route path="/users/edit/:user_id" exact>
          <UserEdit />
        </Route>
        <Route path="/organisations" exact>
          <Organisations />
        </Route>
        <Route path="/translations" exact>
          <UiTranslations />
        </Route>
        <Route path="/translations/edit" >
          <UiTranslation />
        </Route>
        <Route path="*" exact>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
};

export default RouterSuperUser;
