import React, { lazy, useEffect, useState } from "react";
import t from "../translate";
import apiCall from "../api";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LeftBottom from "../course/content/leftBottom.js";
import { setActiveIntervention, setActivePart, setGamification } from "../../actions";
import {appSettings} from "../../custom/settings";
import {handlePoints} from "../gamification/functions";
import parse from 'html-react-parser';
import Hook from "../../custom/hook"; /// zodat we custom js kunnen inschieten ik heb dit nodig in mijnsalvage
import Logout from "../logout";


const Courses = (props) =>{
  const auth = useSelector(state => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();
  const gamification = useSelector(state => state.gamification);

  const [interventions, setInterventions] = useState([])
  const [interventionsSet, setInterventionsSet] = useState(false)

  /// get available interventions
  useEffect(() => {
    apiCall({
      action: "get_interventionsStudent",
      token: auth.token,
      data: {}
    }).then(resp => {

      ///2022-3-21
      ///filter op toegankelijkheid
      if(appSettings.access_date_intervention_is_option){
        let tempInterventions = []

        for(let i = 0 ; i < resp.interventions.length ; i++){
          let auth_rights_obj = auth.rights.interventions.filter(function (int) {
            return int.id === resp.interventions[i].id
          });
          let auth_rights_obj_index = auth.rights.interventions.indexOf(auth_rights_obj[0]);

          ///leeg of niet gezet dan toegankelijk
          if(typeof auth.rights.interventions[auth_rights_obj_index].accessible_from == "undefined" || auth.rights.interventions[auth_rights_obj_index].accessible_from == ""){
            tempInterventions.push(resp.interventions[i])
          } else if(Date.parse(new Date()) > Date.parse(auth.rights.interventions[auth_rights_obj_index].accessible_from)){
            ///reeds toegankelijk gezien toegangsdatum is verstreken
            tempInterventions.push(resp.interventions[i])
          }
        }
        setInterventions(tempInterventions);
      } else {
        setInterventions(resp.interventions);
      }
      setInterventionsSet(true)
    });
  }, [props]);

  function openCourse(id){
    history.push(
      "/course/" + id
    );

    if(appSettings.gamification){
      gamification.points.interventions = handlePoints(gamification, id, "start_intervention", interventions, t("Start " + appSettings.interventieName.toLowerCase()))
      dispatch(setGamification(gamification))
    }

    dispatch(setActiveIntervention(id));
    dispatch(setActivePart("lessons"));

    ///misschien is saven actieve interventie nog wel een idee
  }

  const goTo = () => {
    if(appSettings.home_url_extern){
      window.location = appSettings.home_url_extern;
    }
  }
  return(
    <>
      <Hook type="courses" />
      {!appSettings.included ?
        <nav className="navbar navbar-expand-lg navbar-light courses_navbar">
          <span onClick={()=>goTo()} className={appSettings.home_url_extern ? 'pointer':''}>
            <img src={appSettings.logo} className="logo"/>
          </span>
        </nav>
        :''}
      <div className="dashboard admin center courses">
        <Logout/>
        {interventionsSet && interventions.length > 0 ?
          <div>
            <h1>{t("Cursussen")}</h1>
            <div className="items card_holder">
              {interventions.map((intervention, index) =>
                <div
                  key={intervention.id}
                  className="card"
                  onClick={event =>openCourse(intervention.id)}
                >
                  <div className="image" style={{ backgroundImage: "url('"+(typeof intervention.settings.coverPhoto != "undefined" && intervention.settings.coverPhoto != "" ? intervention.settings.coverPhoto:false)+"')" }}>
                  </div>
                  <div className="content">
                    <h2>{intervention.title}</h2>
                    <div>
                      {appSettings.lesson_subtitle_in_overview == true && intervention.settings.subtitle ?
                        parse(intervention.settings.subtitle)
                        :''}
                    </div>
                    <span className="btn btn-primary">
                      {t("Naar de " + appSettings.interventieName)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          :
          <>
            {interventionsSet  ?
              <div className="wrapper">
                <div className="bg_courses_not_allowed"></div>
                <div className="courses_not_allowed">
                  <h1>{t("Helaas...")}</h1>
                  {t(appSettings.noCoursesAvailable)}
                  {appSettings.included ?
                    <>
                    <br/>
                    <br/>
                    <a href="/" className="btn btn-primary">{t("Terug naar het intranet")}</a>
                    </>
                    :false}
                </div>
              </div>
              :false}
          </>
        }
      </div>
    </>
  )
}

export default Courses
