import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.scss";
//import "./App.css";
import LoadScreen from "./components/loadScreen"

const App = () => {

  const userType = useSelector(state => state.auth.userType);

  const Registration = React.lazy(() => import('./components/registration/chatcourse'));
  const Confirmation = React.lazy(() => import('./components/registration/confirmation'));
  const ResetPassword = React.lazy(() => import('./components/login/resetPassword'));
  const Questionnaire = React.lazy(() => import('./components/questionnaires'));
  const Login = React.lazy(() => import('./components/login'));
  const RouterSuperUser = React.lazy(() => import('./components/superuser/router'));
  const RouterAdmin = React.lazy(() => import('./components/router/admin'));
  const RouterCoach = React.lazy(() => import('./components/router/coach'));
  const RouterStudent = React.lazy(() => import('./components/router/student'));

  const RoleRouter = () => {

    switch (userType) {
      case "superuser":
        return (
            <Suspense fallback={<LoadScreen/>}>
              <RouterSuperUser />
            </Suspense>
          );
        break;
      case "admin":
        return (
            <Suspense fallback={<LoadScreen/>}>
              <RouterAdmin />
            </Suspense>
          );
        break;
      case "coach":
        return (
            <Suspense fallback={<LoadScreen/>}>
              <RouterCoach />
            </Suspense>
          );
      case "student":
        return (
            /*
            2022-01-21 loadscreen eruit om dubbele laad te voorkomen
            */
            <Suspense fallback={false}>
              <RouterStudent />
            </Suspense>
          );
        break;
      default:
        return (
            <Suspense fallback={<LoadScreen/>}>
              <Login />
            </Suspense>
          );
    }

  }

  return (
    <div id="wrapper" className={userType}>
      <BrowserRouter>
        <Switch>
          <Route path="/Registration">
            <Suspense fallback={<LoadScreen/>}>
              <Registration />
            </Suspense>
          </Route>
          <Route path="/Confirmation">
            <Suspense fallback={<LoadScreen/>}>
              <Confirmation />
            </Suspense>
          </Route>
          {/*
            ///dit interfereert met /questionnaire/edit/{id}
            //uitgezet op 2022-2-21 niet relevant in installaties.
            <Route path="/Questionnaire">
              <Suspense fallback={<LoadScreen/>}>
                <Questionnaire />
              </Suspense>
            </Route>
          */}

          <Route path="/ResetPassword">
            <Suspense fallback={<LoadScreen/>}>
              <ResetPassword />
            </Suspense>
          </Route>
          <Route path="*">
            <RoleRouter />
          </Route>
        </Switch>
      </BrowserRouter>

      <div className="overlay"></div>

    </div>
  );
}

export default App;
