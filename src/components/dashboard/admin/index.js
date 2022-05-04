import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import $ from "jquery";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../../utils";
import InterventionLinks from "../../interventionlinks";
import Editintervention from "./editIntervention.js";
import Modal from "../../modal";
import t from "../../translate";
import LeftMenu from "../leftmenu";
import {appSettings} from "../../../custom/settings";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Admin = props => {

  const closeModal = msg => {
    $("#intervention_edit").modal("toggle");
    setMessage(msg);
    getInterventions();
    let refresh = refreshInterventionLinks + 1;
    setRefreshInterventionLinks(refresh); //zorgt ervoor dat props van InterventionLinks wijzigen en deze opnieuw rendert...
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const [state, setState] = useState({
    interventions: [],
    nr_interventions: 0,
    modalState: {
      name: "intervention_edit",
      label: "intervention_edit_label",
      title: "",
      component: Editintervention,
      btnValue: t("Opslaan"),
      componentData: {
        intervention: {
          id: 0,
          title: "",
          settings: {}
        },
        closeModal: closeModal
      }
    }
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshInterventionLinks, setRefreshInterventionLinks] = useState(0);

  const auth = useSelector(state => state.auth);

  let history = useHistory();

  const onClickHandler = (event, intervention) => {
    if (auth.rights.config_access) {
      history.push("/intervention/edit/" + intervention.id);
    } else {
      if (auth.rights.coaches_access) {
        history.push("/intervention/coaches/" + intervention.id);
      } else {
        if (auth.rights.data_access) {
          history.push("/intervention/data/" + intervention.id);
        }
      }
    }
  };

  const addIntervention = () => {
    let newState = getClone(state);
    newState.modalState.componentData.intervention = {
      id: 0,
      title: "",
      settings: {
        intervention_type: "selfhelp",
        selfhelp: {
          lessons: [],
          optionalLessons: [],
          lesson_new_title: ""
        },
        research: false,
        goals: [],
        questionnaires: []
      }
    };
    newState.modalState.title = t("Toevoegen interventie");
    setState(newState);

    $("#intervention_edit").modal("toggle");
  };

  const [interventions, setInterventions] = useState([])
  const [organisation, setOrganisation] = useState(false)

  useEffect(() => {
    {
      getInterventions()
    }
  }, []);

  function getInterventions(){
    //api aanroepen
    apiCall({
      action: "get_interventions",
      token: auth.token,
      data: {}
    }).then(resp => {
      setInterventions(resp.interventions)
      setOrganisation(resp.organisation) // we moeten de max aantal interventies achterhalen
    });
  }

  return (
    <div className="container dashboard admin">
      <LeftMenu />
      {organisation && organisation.rights && (organisation.rights.nr_interventions > interventions.length) ?
        <button
          className={
            state.nr_interventions >= state.interventions.length
              ? "btn-secondary btn"
              : "hiddem"
          }
          onClick={addIntervention}
        >
          {t("Nieuwe " + appSettings.interventieName.toLowerCase())} (
          {organisation.rights.nr_interventions - interventions.length})
        </button>
       :false }

      <div
        className={message.length < 1 ? "hidden" : "alert alert-success"}
        role="alert"
      >
        {message}
      </div>
      <div
        className={
          errorMessage.length < 1 ? "hidden" : "alert alert-danger"
        }
        role="alert"
      >
        {errorMessage}
      </div>

      <InterventionLinks
        refreshState={refreshInterventionLinks}
        onClickHandler={onClickHandler}
        interventions={interventions}
        getInterventions={getInterventions}
      />

      <Modal {...state.modalState} />
    </div>
  );
};

export default Admin;
