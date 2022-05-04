import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import NavBar from "../navBar";
import Dashboard from "../dashboard/coach";
import CourseDashboard from "../dashboard/coach/course";
import Students from "../students";
import InterventionCoaches from "../coaches/";
import apiCall from "../api";
import { useSelector } from "react-redux";

const RouterCoach = () => {

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const [supervisorFor, setSupervisorFor] = useState([]);
  const [interventions, setInterventions] = useState([])
  const [isActiveInterventionChatCourse, setIsActiveInterventionChatCourse] = useState(false)

  useEffect(() => {
    //api aanroepen
    apiCall({
      action: "get_interventions",
      token: auth.token,
      data: {}
    }).then(resp => {
      setInterventions(resp.interventions)
    });

    let localSupervisorFor = [];
    auth.rights.interventions.forEach(function (interv, index) {
      if (interv.isSupervisor)
      {
        localSupervisorFor.push(interv.id);
      }
    });
    setSupervisorFor(localSupervisorFor);
  }, []);

  useEffect(() => {

  }, [intervention]);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/" exact >
          <NavBar />
          <Dashboard interventions={interventions}/>
        </Route>
        <Route path="/students/:interventionId">
          <Students interventions={interventions}/>
        </Route>
        {supervisorFor.indexOf(intervention.id) > -1 ?
          <Route path="/intervention/coaches/" >
            <InterventionCoaches interventions={interventions}/>
          </Route>
        : false}}

        <Route path="/dashboard/:interventionId">
          <CourseDashboard interventions={interventions}/>
        </Route>

        <Route path="*" exact>
          <Redirect to="/" />
        </Route>



      </Switch>
    </Router>
  );
};

export default RouterCoach;
