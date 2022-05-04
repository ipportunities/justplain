import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import { getClone } from "../../utils";
import t from "../../translate";

const Editorganisation = forwardRef((props, ref) => {
  const [state, setState] = useState({
    organisation: {
      id: 0,
      name: "",
      rights: {
        nr_interventions: 1
      },
      removeOrganisation: false
    }
  });

  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);

  //laden state met data uit props
  useEffect(() => {
    const newState = getClone(state);
    newState.organisation = props.organisation;
    newState.organisation.removeOrganisation = false;
    setState(newState);
    setErrorMessage("");
  }, [props.organisation]);

  const onChange = e => {
    e.preventDefault();
    const newState = getClone(state);
    if (e.target.name.substr(0, 7) === "rights_") {
      newState.organisation.rights[e.target.name.substr(7)] = e.target.value;
    } else {
      newState.organisation[e.target.name] = e.target.value;
    }
    setState(newState);
    setErrorMessage("");
  };

  const toggleRemoveOrganisation = e => {
    const newState = getClone(state);
    if (newState.organisation.removeOrganisation) {
      newState.organisation.removeOrganisation = false;
    } else {
      newState.organisation.removeOrganisation = true;
    }
    setState(newState);
  };

  //deze functie wordt aangeroepen door button in component Modal -> ref functie koppelt
  //componenten aan elkaar
  useImperativeHandle(ref, () => ({
    submitHandler() {
      if (state.organisation.removeOrganisation) {
        if (
          !window.confirm(
            t("Weet u zeker dat u deze organisatie wilt verwijderen?")
          )
        ) {
          props.closeModal("");
          return;
        }
      }
      apiCall({
        action: "save_organisation",
        token: auth.token,
        data: {
          organisation: state.organisation
        }
      }).then(resp => {
        props.closeModal(resp.msg);
      });
    }
  }));

  return (
    <div>
      <div
        className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"}
        role="alert"
      >
        <i className="fas fa-exclamation-circle"></i> &nbsp;
        <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="name">{t("Naam")}</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            aria-describedby="name"
            placeholder=""
            value={state.organisation.name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rights_nr_interventions">
            {t("Aantal interventies")}
          </label>
          <input
            type="number"
            className="form-control"
            id="rights_nr_interventions"
            name="rights_nr_interventions"
            aria-describedby="rights_nr_interventions"
            placeholder=""
            value={state.organisation.rights.nr_interventions}
            onChange={onChange}
          />
        </div>
        <div className={props.organisation.id === 0 ? "hidden" : "form-check"}>
          <input
            className="form-check-input"
            type="checkbox"
            id="remove"
            name="remove"
            onChange={toggleRemoveOrganisation}
            checked={state.organisation.removeOrganisation}
          />
          <label className="form-check-label" htmlFor="remove">
            {t("Verwijder organisatie")}
          </label>
        </div>
      </form>
    </div>
  );
});

export default Editorganisation;
