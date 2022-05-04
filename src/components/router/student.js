import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
//import Dashboard from "../dashboard/student";
import Course from "../course";
import Courses from "../courses";
import QuestionnaireFillOut from "../questionnaires/fillOut.js";
import { setActiveIntervention, setIntervention, setAnswersLessons, setPageHistory, setUiTranslation, setActiveLanguage, setAnswersHomework } from "../../actions";
import { useLocation } from "react-router-dom";
import {appSettings} from "../../custom/settings";

const RouterStudent = () => {

  let location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const [themeId, setThemeId] = useState(false)

  const auth = useSelector(state => state.auth);
  const activeIntervention = useSelector(state => state.activeIntervention);
  const intervention = useSelector(state => state.intervention);
  //const answers = useSelector(state => state.answersLessons);
  //let location = useLocation(); //current url

  const checkRightsIntervention = () => {
    //nog niet bekend welke cursus geladen moet worden?\
    let query_string = location.pathname.replace(process.env.PUBLIC_URL, "").split("/");

    ////2022-3-21 aantal interventies in auth kan langer zijn dan daadwerkelijk aantal interventies...
    if (activeIntervention === 0 && query_string[1] != "courses")
    {

      if (auth.rights && auth.rights.interventions && auth.rights.interventions.length === 1)
      {
        //activeIntervention vastleggen in redux store
        dispatch(
          setActiveIntervention(
            auth.rights.interventions[0].id
          )
        );
        /// check intervention type 8-12-2021 lijkt te werken...
        if(intervention.id > 0){
          if(intervention.settings.intervention_type ===  'chatcourse'){
            history.push(process.env.PUBLIC_URL + "/course/"+auth.rights.interventions[0].id+"/my-homework")
          } else {
            history.push(process.env.PUBLIC_URL + "/course/"+auth.rights.interventions[0].id+"/lessons")
          }
        }
      }
      else if(query_string[1] != "courses")
      {
        history.push(process.env.PUBLIC_URL + "/courses/")
        //window.location.reload();
      }
    }
  }

  useEffect(() => {
    /// zet het theme pas als als de interventie geladen is <= voorkomt een eerste glimp van het basis thema
    if(intervention.id > 0){
      let themeId = appSettings.baseThemeID; /// als niks gezet dan het basis thema
      if(intervention.settings.themeId){
        themeId = intervention.settings.themeId;
      }
      setThemeId(themeId)
    }
  }, [intervention])

  useEffect(() => {
    //reload van een pagina? Dan o.b.v. url de intervention bepalen
    let querystring = location.pathname.replace(process.env.PUBLIC_URL, "").split("/");

    if(querystring[1] == "courses"){
      setThemeId(appSettings.baseThemeID)
    }

    if (querystring.length > 2 && querystring[2].length > 0)
    {
      if (!isNaN(querystring[2]))
      {
        if (activeIntervention !== parseInt(querystring[2]))
        {
          let hasRights = auth.rights.interventions.find((interv) => {
            return parseInt(interv.id) === parseInt(querystring[2])
          });
          if (hasRights)
          {
            dispatch(
              setActiveIntervention(
                parseInt(querystring[2])
              )
            );
          } else {
            checkRightsIntervention();
          }
        }
      }
      else
      {
        //ongeldige intervention_id in URL
        checkRightsIntervention();
      }
    }
    else
    {
      checkRightsIntervention();
    }
  }, [location.pathname])

  useEffect(() => {

    //bij laden language preference ophalen
    if (auth.user_id !== 0)
    {
      let language_id_pref = auth.preferences.find(pref => {
        return pref.option === 'language_id'
      })
      if (typeof language_id_pref === 'undefined')
      {
        language_id_pref = 1; //dutch
      }
      dispatch(setActiveLanguage(parseInt(language_id_pref.value)));

      //settings van de interventie ophalen en in de store plaatsen
      //plus antwoorden van de student ophalen voor deze interventie
      if (intervention.id !== activeIntervention && parseInt(activeIntervention) !== 0)
      {
        //interventie settings ophalen en in redux store plaatsen
        apiCall({
          action: "get_intervention_settings",
          token: auth.token,
          data: {
            intervention_id: activeIntervention,
            include_forms: true, //tijdelijk...
            language_id: language_id_pref.value
          }
        }).then(resp => {
          dispatch(setUiTranslation(language_id_pref.value, resp.settings.ui_translation));
          dispatch(
            setIntervention(
              activeIntervention,
              resp.organisation_id,
              resp.title,
              resp.settings
            )
          );
          if(resp.settings.intervention_type == "chatcourse"){
            //antwoorden huiswerk ophalen en in redux store plaatsen
            //antwoorden lessen ophalen en in redux store plaatsen
            apiCall({
              action: "get_all_homework_answers",
              token: auth.token,
              data: {
                id: activeIntervention
              }
            }).then(resp => {
              dispatch(
                setAnswersHomework(
                  activeIntervention,
                  resp.answers
                  )
              )
            });
          } else {
            //antwoorden lessen ophalen en in redux store plaatsen
            apiCall({
              action: "get_course_answers",
              token: auth.token,
              data: {
                id: activeIntervention
              }
            }).then(resp => {
              dispatch(
                setAnswersLessons(
                  activeIntervention,
                  resp.answers
                  )
              )
              dispatch(
                setPageHistory(
                  activeIntervention,
                  resp.pageHistory
                  )
              )
            });
          }
        });



      }
    }
  }, [activeIntervention, auth]);


  function getTheme(){
    /// alleen iets zetten als duidelijk is welk thema geladen moet worden
    if(themeId){
      return(<link rel="stylesheet" type="text/css" href={require('../../custom/themes/'+themeId+'/index.scss')} />)
    }
  }

  return (
    <div className={"theme" + ' theme_'+themeId}>
      {getTheme()}
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          {/*pas laden als je weet of er cursussen zijn*/}
          <Route path="/" exact>
          {activeIntervention > 0 ?<Course />:<Courses />}
          </Route>
          <Route path="/courses">
            <Courses />
          </Route>
          <Route path="/course">
            <Course />
          </Route>
          <Route path="/questionnaire">
            <QuestionnaireFillOut />
          </Route>
          <Route path="*" exact>
          <Redirect to="/" />
        </Route>
        </Switch>
      </Router>
      {appSettings.gamification ?
        <div className="pointsContainer"></div>
        :''}
    </div>

  );
};

export default RouterStudent;
