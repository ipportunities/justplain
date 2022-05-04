import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import $ from "jquery";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../../utils";
import LeftMenu from "../../dashboard/leftmenu";
import Modal from "../../modal";
import AddTranslation from "./add_translation";
import t from "../../translate";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

//functie die lijst opmaakt met organisaties
const ListItems = props => {

  const history = useHistory();

  const editTranslation = translation_id => {
    history.push("/translations/edit/"+translation_id);
  };

  return (
    <tbody>
      {props.state.translations.map(translation => {
        return (
          <tr
            key={translation.id}
            className="pointer rowHover"
            onClick={() => editTranslation(translation.id)}
          >
            <td>{translation.id}</td>
            <td>{translation.language}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

const UiTranslations = () => {
  //deze functie wordt als property doorgegeven aan modal en vandaar naar editOrganisation
  //en aangeroepen na een geslaagde saveOrganisatie
  const closeModal = msg => {
    $("#translation_add").modal("toggle");
    setMessage(msg);
    getTranslations();
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const [state, setState] = useState({
    translations: [],
    modalState: {
      name: "translation_add",
      label: "translation_add_label",
      title: t("Vertaling toevoegen"),
      component: AddTranslation,
      btnValue: t("Opslaan"),
      componentData: {
        closeModal: closeModal
      }
    }
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);

  const getTranslations = () => {
    //api aanroepen
    apiCall({
      action: "get_ui_translations",
      token: auth.token,
      data: {}
    }).then(resp => {
      const newState = getClone(state);
      newState.translations = resp.languages;
      setState(newState);
    });
  };

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {
    getTranslations();
  }, []);

  const addTranslation = () => {
    $("#translation_add").modal("toggle");
  };

  return (
    <div className="whiteWrapper">
      <LeftMenu />
      <div className="container dashboard_container">
        <h2>
          <i className="fas fa-language"></i> {t("UI Vertalingen")}
          <button
            className="btn btn-primary btn-sm btn-trans float-right"
            onClick={addTranslation}
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
              <th scope="col">{t("Taal")}</th>
            </tr>
          </thead>
          <ListItems state={state} />
        </table>
      </div>

      <Modal {...state.modalState} />
    </div>
  );
};

export default UiTranslations;
