import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import apiCall from "../api";
import { getClone } from "../utils";
import t from "../translate";

const AddTranslation = forwardRef((props, ref) => {

  const [translation, setTranslation] = useState({
    intervention_id: 0,
    language_id: 0
  });
  
  const [errorMessage, setErrorMessage] = useState("");
  const [languages, setLanguages] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [options, setOptions] = useState([]);

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  useEffect(() => {
    //api aanroepen, talen ophalen
    apiCall({
      action: "get_languages",
      token: auth.token,
      data: {}
    }).then(resp => {
      setLanguages(resp.languages);
    });
  }, []);

  useEffect(() => {
    if (typeof props.intervention_id !== 'undefined')
    {
      apiCall({
        action: "get_intervention_translations",
        token: auth.token,
        data: {
          intervention_id: props.intervention_id
        }
      }).then(resp => {
        setTranslations(resp.languages);
      });
    }
  }, [props])

  useEffect(() => {

    if (typeof intervention.id !== 'undefined' && languages.length > 0)
    {
      let newOptions = languages.filter(lang => !translations.includes(lang));
      if (intervention.settings.language_id !== undefined)
      {
        let indexKey = newOptions.findIndex(option => {
          return parseInt(option.id) === parseInt(intervention.settings.language_id)
        })
        if (typeof indexKey !== undefined && indexKey > -1)
        {
          newOptions.splice(indexKey, 1);
        }
      }
      setOptions(newOptions);
      
    }

  }, [intervention, languages, translations])

  //deze functie wordt aangeroepen door button in component Modal -> ref functie koppelt
  //componenten aan elkaar
  useImperativeHandle(ref, () => ({

    submitHandler() {

      if (translation.language_id === 0)
      {
        setErrorMessage(t("Selecteer eerst een taal waarvoor u een vertaling wil toevoegen!"));
      }
      else
      {
        apiCall({
          action: "add_intervention_translation",
          token: auth.token,
          data: translation
        }).then(resp => {
          props.closeModal(t("De nieuwe vertaling is toegevoegd."));
        });
      } 
    }
  }));

  const onChange = e => {
    e.preventDefault();
    const newTranslation = getClone(translation);
    newTranslation.language_id = e.target.value;
    newTranslation.intervention_id = intervention.id;
    setTranslation(newTranslation);
    setErrorMessage("");
  };
  
  return(
    <div>
      <label className="form-check-label" htmlFor="language_id">
        {t("Kies een taal")}
      </label>
      <div
        className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
        role="alert"
      >
        <i className="fas fa-exclamation-circle"></i> &nbsp;
        <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
      </div>
      <select
        id="language_id"
        name="language_id"
        className="form-control"
        value={translation.language_id}
        onChange={onChange}
      >
        <option value=""></option>
        {
          options.map((option, index) => {
            return(
              <option key={index} value={option.id}>{option.language}</option>
            )
          })
        }
      </select>
    </div>
  )
});

export default AddTranslation;