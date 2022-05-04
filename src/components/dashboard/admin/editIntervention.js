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

const Editintervention = forwardRef((props, ref) => {
  const [state, setState] = useState({
    intervention: {
      id: 0,
      title: "",
      settings: {}
    },
    organisations: [],
    types: [],
    showPassword: false
  });

  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);

  //laden state met data uit props
  useEffect(() => {
    const newState = getClone(state);
    newState.intervention = props.intervention;
    setState(newState);
    setErrorMessage("");
  }, [props.intervention]);

  const onChange = e => {
    e.preventDefault();
    const newState = getClone(state);
    newState.intervention[e.target.name] = e.target.value;
    setState(newState);
    setErrorMessage("");
    return false;
  };

  const onSubmit = e => {
    e.preventDefault();
  };

  //deze functie wordt aangeroepen door button in component Modal -> ref functie koppelt
  //componenten aan elkaar
  useImperativeHandle(ref, () => ({
    submitHandler() {
      apiCall({
        action: "save_intervention",
        token: auth.token,
        data: {
          intervention: state.intervention
        }
      }).then(resp => {
        props.closeModal(resp.msg);
      });
    }
  }));

  //.log("firstname: "+state.intervention.firstname);
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
          <label htmlFor="title">{t("Titel")}</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            aria-describedby="firstname"
            placeholder=""
            value={state.intervention.title}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </div>
  );
});

export default Editintervention;
