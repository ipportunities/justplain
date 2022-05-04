import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import { useHistory } from "react-router-dom";
import t from "../translate";
import LeftMenu from "../dashboard/leftmenu";
import { useLocation } from "react-router-dom";
import { setIntervention } from "../../actions";
import { appSettings } from '../../custom/settings'

const EmailSettings = (props) => {

  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);

  const [questionnairesSet, setQuestionnairesSet] = useState([])

  useEffect(() => {
    let intervention_id = location.pathname.split("/")[3];
    if (intervention.id === 0 && intervention_id !== intervention.id) {
      apiCall({
        action: "get_intervention_settings",
        token: auth.token,
        data: {
          intervention_id,
          language_id: uiTranslation.language_id
        }
      }).then(resp => {
        dispatch(
          setIntervention(
            resp.intervention_id,
            resp.organisation_id,
            resp.title,
            resp.settings
          )
        );
      });
    }
  }, []);

  function questionnaireSelect(){
    return(
      <select>
        <option value="">{t("Selecteer vragenlijst")}</option>
        {
          intervention.settings.questionnaires.map((q, index) => {
            return (
              <option key={index}>
                {q.title.charAt(0).toUpperCase() + q.title.slice(1)}
              </option>
            )
          })
        }
      </select>
    )
  }

  function removeQuestionnaire(id){
    let temp = [...questionnairesSet];
    let index = temp.indexOf(id);
    if (index > -1) {
      temp.splice(index, 1)
      setQuestionnairesSet(temp);
    }
  }


  function addQuestionnaire(id){
    let temp = [...questionnairesSet];
    temp.push(id)
    setQuestionnairesSet(temp)
  }

  return(
    <div className="emailsettings">
      <nav className="navbar navbar-expand-lg navbar-light">
        <h2>
          <span className="pointer" onClick={()=>history.push("/intervention/edit/" + intervention.id + "/general/")}>{" " + intervention.title + " "} </span>
        </h2>
        <h2 className="noPadding">
          &nbsp; > {t("Opbouw ")} {t(appSettings.interventieName.toLowerCase())}
        </h2>
      </nav>
      <LeftMenu />
      <div className="container dashboard_container">
        <h3>{t("Opbouw")} {t(appSettings.interventieName.toLowerCase())}</h3><br />
        {t("Zet vragenlijsten die afgerond moeten worden alvorens verder te kunnen")}<br/><br/>
        <div className="elements">
          <div className="element">
            <div className="lesson">
              {t("Start ")} {t(appSettings.interventieName.toLowerCase())}
              <span className="options">
                {!questionnairesSet.includes("start") ?
                  <span className="btn btn-primary" onClick={(e) => addQuestionnaire("start", e)}><i className="fa fa-plus"></i></span>
                  :
                  <></>
                }
              </span>
            </div>
            {questionnairesSet.includes("start") ?
              <div className="questionnaire_options">
                {questionnaireSelect()}
                <span className="options">
                  <span className="grey btn showOnHover" onClick={(e) => removeQuestionnaire("start", e)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>
                </span>
                <div className="">
                  {t("Uitnodiging")}
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider_switch round" ></span>
                  </label>
                </div>
                <div className="">
                  {t("Reminders")}
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider_switch round" ></span>
                  </label>
                </div>
              </div>
              :
              <></>
            }
          </div>
          {intervention.settings.selfhelp.lessons.map((l, index) => {
            return (
              <>
                <div className="element">
                  <div key={index} className="lesson">
                    {l.title.charAt(0).toUpperCase() + l.title.slice(1)} {l.id}
                    <span className="options">
                      {!questionnairesSet.includes(l.id) ?
                        <span className="btn btn-primary" onClick={(e) => addQuestionnaire(l.id, e)}><i className="fa fa-plus"></i></span>
                        :
                        <></>
                      }
                    </span>
                  </div>
                  {questionnairesSet.includes(l.id) ?
                    <div className="questionnaire_options">
                      {questionnaireSelect()}
                      <span className="options">
                        <span className="grey btn showOnHover" onClick={(e) => removeQuestionnaire(l.id, e)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>
                      </span>
                      <div className="">
                        {t("Uitnodiging")}
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider_switch round" ></span>
                        </label>
                      </div>
                      <div className="">
                        {t("Reminders")}
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider_switch round" ></span>
                        </label>
                      </div>
                    </div>
                    :
                    <></>
                  }
                </div>
              </>
            )
          })}
          <div className="element">
            <div className="lesson">
              {t("Afronding ")} {t(appSettings.interventieName.toLowerCase())}
              <span className="options">
                {!questionnairesSet.includes("finish") ?
                  <span className="btn btn-primary" onClick={(e) => addQuestionnaire("finish", e)}><i className="fa fa-plus"></i></span>
                  :
                  <></>
                }
              </span>
            </div>
            {questionnairesSet.includes("finish") ?
              <div className="questionnaire_options">
                {questionnaireSelect()}
                <span className="options">
                  <span className="grey btn showOnHover" onClick={(e) => removeQuestionnaire("finish", e)} data-tip={t("Verwijder item")}><i className="fa fa-minus"></i></span>
                </span>

                <div className="">
                  {t("Uitnodiging")}
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider_switch round" ></span>
                  </label>
                </div>
                <div className="">
                  {t("Reminders")}
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider_switch round" ></span>
                  </label>
                </div>
              </div>
              :
              <></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default EmailSettings;
