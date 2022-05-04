import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import $ from "jquery";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../../utils";
import LeftMenu from "../../dashboard/leftmenu";
import Modal from "../../modal";
import Editorganisation from "../organisations/editorganisation.js";
import t from "../../translate";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

//functie die lijst opmaakt met organisaties
const ListItems = props => {
  const viewOrganisation = organisation => {
    props.setStateCallback(organisation, t("Wijzigen organisatie"));
    $("#organisation_edit").modal("toggle");
  };

  return (
    <tbody>
      {props.state.organisations.map(organisation => {
        //const rights = JSON.parse(organisation.rights);
        return (
          <tr
            key={organisation.id}
            className="pointer rowHover"
            onClick={() => viewOrganisation(organisation)}
          >
            <td>{organisation.id}</td>
            <td>{organisation.name}</td>
            <td>{organisation.rights.nr_interventions}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

const Organisations = () => {
  //deze functie wordt als property doorgegeven aan modal en vandaar naar editOrganisation
  //en aangeroepen na een geslaagde saveOrganisatie
  const closeModal = msg => {
    $("#organisation_edit").modal("toggle");
    setMessage(msg);
    getOrganisations();
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const [state, setState] = useState({
    organisations: [],
    modalState: {
      name: "organisation_edit",
      label: "organisation_edit_label",
      title: "",
      component: Editorganisation,
      btnValue: t("Opslaan"),
      componentData: {
        organisation: {
          id: 0,
          name: "",
          rights: {
            nr_interventions: 1
          },
          removeOrganisation: false
        },
        closeModal: closeModal
      }
    }
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);

  const getOrganisations = () => {
    //api aanroepen
    apiCall({
      action: "get_organisations",
      token: auth.token,
      data: {}
    }).then(resp => {
      const newState = getClone(state);
      newState.organisations = resp.organisations;
      setState(newState);
    });
  };

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {
    getOrganisations();
  }, []);

  //deze functie wordt aangeroepen bij aanklikken van een organisatie in de list (ListItems)
  const setStateCallback = (organisation, title) => {
    let newState = getClone(state);
    newState.modalState.componentData.organisation = organisation;
    newState.modalState.title = title;
    setState(newState);
  };

  const addOrganisation = () => {
    setStateCallback(
      {
        id: 0,
        name: "",
        rights: {
          nr_interventions: 1
        }
      },
      t("Toevoegen organisatie")
    );
    $("#organisation_edit").modal("toggle");
  };

  return (
    <div className="whiteWrapper">
      <LeftMenu />
      <div className="container dashboard_container">
        <h2>
          <i className="fas fa-building"></i> {t("Organisaties")}
          <button
            className="btn btn-primary btn-sm btn-trans float-right"
            onClick={addOrganisation}
          >
            {t("Toevoegen")}
          </button>
        </h2>

        <div
          className={message.length < 1 ? "hidden" : "alert alert-success"}
          role="alert"
        >
          {message}
        </div>
        <div
          className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
          role="alert"
        >
          {errorMessage}
        </div>

        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t("Organisatie")}</th>
              <th scope="col">{t("Aantal interventies")}</th>
            </tr>
          </thead>
          <ListItems state={state} setStateCallback={setStateCallback} />
        </table>
      </div>

      <Modal {...state.modalState} />
    </div>
  );
};

export default Organisations;
