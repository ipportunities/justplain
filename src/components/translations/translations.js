import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import AddTranslation from "./add_translation.js";
//import { setIntervention } from "../../../actions";
import t from "../translate";
//import { getClone } from "../../utils";
import apiCall from "../api";
import $ from "jquery";
import Modal from "../modal";
import { getClone } from "../utils/index.js";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Languages = () => {

  const history = useHistory();
  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [translations, setTranslations] = useState([]);

  const closeModal = msg => {
    $("#translation_add").modal("toggle");
    setMessage(msg);
    getTranslations();
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const [modalState, setModalState] = useState({
    name: "translation_add",
    label: "translation_edit_label",
    title: t("Toevoegen vertaling"),
    component: AddTranslation,
    btnValue: t("Opslaan"),
    componentData: {
      translation: {
        id: 0,
        intervention_id: intervention.id,
        language_id: 0
      },
      closeModal: closeModal
    }
  })


  const getTranslations = () => {
    //api aanroepen, talen ophalen
    apiCall({
      action: "get_intervention_translations",
      token: auth.token,
      data: {
        intervention_id: intervention.id
      }
    }).then(resp => {
      setTranslations(resp.languages);
    });
  }

  useEffect(() => {

    if (parseInt(intervention.id) !== 0)
    {
      getTranslations();
    }
  }, [intervention]);


  const addTranslation = () => {

    let newModalState = getClone(modalState);
    newModalState.componentData.translation = {
      id: 0,
      intervention_id: intervention.id,
      language_id: 0
    }
    setModalState(newModalState);

    $("#translation_add").modal("toggle");

  }

  const editTranslation = (translation_id) => {
    history.push("/translation/edit/" + translation_id);
  }

  return (
    <div>

      <div className={"items"}>
        {
          translations.map((translation, index) => {
            return (
              <div key={index} className="item">
                <div className="form-group">
                  <table onClick={() => editTranslation(translation.id)}>
                    <tbody>
                      <tr>
                        <td>

                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            id={"items_" + index}
                            name={"items_" + index}
                            aria-describedby={"items_" + index}
                            //value={JSON.parse(window.atob(lesson.settings)).title}
                            value={translation.language}
                            disabled={true}
                          />
                        </td>
                        <td>
                          <div className="lesson-controls">
                            <span
                              data-tip={t("Wijzig les")}
                              className="btn edit disabled"

                            >
                              <i className="fas fa-pen"></i>
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })
        }
        <div className="form-group" onClick={() => addTranslation()} id="new">
          <input
            type="text"
            className="form-control"

            placeholder={t("Voeg een vertaling toe")}
            disabled={true}

          />
          <span
            data-tip={t("Voeg een vertaling toe")}
            className="btn edit disabled"
          >
            <i className="fas fa-plus"></i>
          </span>
        </div>
      </div>


      <div
          className={message.length < 1 ? "alert" : "alert alert-success"}
          role="alert"
        >
          {message}
        </div>
        <div
          className={errorMessage.length < 1 ? "alert" : "alert alert-danger"}
          role="alert"
        >
          {errorMessage}
        </div>
        <Modal {...modalState} />
    </div>
  )
}

export default Languages;
