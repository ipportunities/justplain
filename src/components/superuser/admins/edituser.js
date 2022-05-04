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

const Edituser = forwardRef((props, ref) => {
  const [state, setState] = useState({
    user: {
      id: 0,
      firstname: "",
      insertion: "",
      lastname: "",
      email: "",
      phone: "",
      organisation_id: 0,
      type: "",
      login: "",
      password: "",
      password_check: "",
      rights: {
        config_access: false, 
        coaches_access: false,
        data_access: false,
      },
      removeUser: false
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
    newState.user = props.user;
    newState.user.password = "";
    newState.user.password_check = "";
    newState.organisations = props.organisations;
    switch (auth.userType) {
      case "superuser":
        newState.types = ["superuser", "admin"];
        break;
      case "admin":
        newState.types = ["admin", "coach"];
        break;
      //case 'coach':
      //    newState.types = ["student"];
      //   break;
    }
    if (newState.user.id == 0) {
      newState.showPassword = true;
    } else {
      newState.showPassword = false;
    }
    newState.user.removeUser = false;
    setState(newState);
    setErrorMessage("");
  }, [props.user]);

  const onChange = e => {
    e.preventDefault();
    const newState = getClone(state);
    newState.user[e.target.name] = e.target.value;
    setState(newState);
    setErrorMessage("");
  };

  const toggleShowPassword = e => {
    const newState = getClone(state);
    if (newState.showPassword) {
      newState.showPassword = false;
    } else {
      newState.showPassword = true;
    }
    setState(newState);
  };

  const toggleRemoveUser = e => {
    const newState = getClone(state);
    if (newState.user.removeUser) {
      newState.user.removeUser = false;
    } else {
      newState.user.removeUser = true;
    }
    setState(newState);
  };

  const toggleRights = (e, accessType) => {

    const newState = getClone(state);
    
    if (e.target.id.substr(-2) === "ja")
    {
      newState.user.rights[accessType + "_access"] = true;
    }
    else
    {
      newState.user.rights[accessType + "_access"] = false;
    }

    setState(newState);
  }

  //deze functie wordt aangeroepen door button in component Modal -> ref functie koppelt
  //componenten aan elkaar
  useImperativeHandle(ref, () => ({
    submitHandler() {
      if (state.user.removeUser) {
        if (
          !window.confirm(
            t("Weet u zeker dat u deze gebruiker wilt verwijderen?")
          )
        ) {
          props.closeModal("");
          return;
        }
      }

      //rights zetten...


      apiCall({
        action: "save_user",
        token: auth.token,
        data: {
          user: state.user
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
        <div className="form-row align-items-center">
          <div className="col-auto">
            <label htmlFor="firstname">{t("Voornaam")}</label>
            <input
              type="text"
              className="form-control"
              id="firstname"
              name="firstname"
              aria-describedby="firstname"
              placeholder=""
              value={state.user.firstname}
              onChange={onChange}
            />
          </div>
          <div className="col-auto col-sm">
            <label htmlFor="insertion">{t("Tussenvoegsel")}</label>
            <input
              type="text"
              className="form-control"
              id="insertion"
              name="insertion"
              aria-describedby="insertion"
              placeholder=""
              value={state.user.insertion}
              onChange={onChange}
            />
          </div>
          <div className="col-auto">
            <label htmlFor="lastname">{t("Achternaam")}</label>
            <input
              type="text"
              className="form-control"
              id="lastname"
              name="lastname"
              aria-describedby="lastname"
              placeholder=""
              value={state.user.lastname}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-row align-items-center">
          <div className="col">
            <label htmlFor="email">{t("E-mail")}</label>
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              aria-describedby="email"
              placeholder=""
              value={state.user.email}
              onChange={onChange}
            />
          </div>
          <div className="col">
            <label htmlFor="phone">{t("Telefoonnummer")}</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              aria-describedby="phone"
              placeholder=""
              value={state.user.phone}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="form-row align-items-center">
          <div className="col">
            <label htmlFor="type">{t("Type")}</label>
            <select
              id="type"
              name="type"
              className="form-control"
              value={state.user.type}
              disabled={state.user.id != 0 ? "disabled" : ""}
              onChange={onChange}
            >
              <option value=""></option>
              {state.types.map(type => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label htmlFor="organisation_id">{t("Organisatie")}</label>
            <select
              id="organisation_id"
              name="organisation_id"
              className="form-control"
              value={state.user.organisation_id}
              disabled={state.user.id != 0 ? "disabled" : ""}
              onChange={onChange}
            >
              <option value="0"></option>
              {state.organisations.map(org => (
                <option value={org.id} key={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={state.user.type == 'admin' != 0 ? "form-group" : "hidden"}>
          
          <label>{t("Toegang tot")}</label>

          <div className="form-check">
            <label>Configureren interventie </label><br />
            <input
              className="form-check-input"
              type="radio"
              name="config_access"
              id="config_access_ja"
              onChange={(e) => toggleRights(e, 'config')}
              checked={state.user.rights.config_access}
            /> 
            <label className="form-check-label" htmlFor="config_access_ja">
              {t("Ja")}
            </label>
            <input
              className="form-check-input"
              type="radio"
              name="config_access"
              id="config_access_nee"
              onChange={(e) => toggleRights(e, 'config')}
              checked={!state.user.rights.config_access}
            />
            <label className="form-check-label" htmlFor="config_access_nee">
              {t("Nee")}
            </label>
          </div>

          <div className="form-check">
            <label>Managen coaches </label><br />
            <input
              className="form-check-input"
              type="radio"
              name="coaches_access"
              id="coaches_access_ja"
              onChange={(e) => toggleRights(e, 'coaches')}
              checked={state.user.rights.coaches_access}
            />
            <label className="form-check-label" htmlFor="coaches_access_ja">
              {t("Ja")}
            </label>
            <input
              className="form-check-input"
              type="radio"
              name="coaches_access"
              id="coaches_access_nee"
              onChange={(e) => toggleRights(e, 'coaches')}
              checked={!state.user.rights.coaches_access}
            />
            <label className="form-check-label" htmlFor="coaches_access_nee">
              {t("Nee")}
            </label>
          </div>

          <div className="form-check">
            <label>Onderzoeks data </label><br />
            <input
              className="form-check-input"
              type="radio"
              name="data_access"
              id="data_access_ja"
              onChange={(e) => toggleRights(e, 'data')}
              checked={state.user.rights.data_access}
            />
            <label className="form-check-label" htmlFor="data_access_ja">
              {t("Ja")}
            </label>
            <input
              className="form-check-input"
              type="radio"
              name="data_access"
              id="data_access_nee"
              onChange={(e) => toggleRights(e, 'data')}
              checked={!state.user.rights.data_access}
            />
            <label className="form-check-label" htmlFor="data_access_nee">
              {t("Nee")}
            </label>
          </div>
              
        </div>



        <div className="form-group">
          <label htmlFor="login">{t("Gebruikersnaam")}</label>
          <input
            type="text"
            className="form-control"
            id="login"
            name="login"
            aria-describedby="login"
            placeholder=""
            value={state.user.login}
            onChange={onChange}
          />
        </div>
        <div className={state.user.id != 0 ? "form-check" : "hidden"}>
          <input
            className="form-check-input"
            type="checkbox"
            id="showPassword"
            onChange={toggleShowPassword}
            checked={state.showPassword}
          />
          <label className="form-check-label" htmlFor="showPassword">
            {t("Wachtwoord wijzigen")}
          </label>
          <br />
          <br />
        </div>
        <div
          className={
            state.showPassword ? "form-row align-items-center" : "hidden"
          }
        >
          <div className="col">
            <label htmlFor="login">{t("Wachtwoord")}</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              aria-describedby="password"
              placeholder=""
              value={state.user.password}
              onChange={onChange}
            />
          </div>
          <div className="col">
            <label htmlFor="login">{t("Wachtwoord ter controle")}</label>
            <input
              type="password"
              className="form-control"
              id="password_check"
              name="password_check"
              aria-describedby="password_check"
              placeholder=""
              value={state.user.password_check}
              onChange={onChange}
            />
          </div>
        </div>
        <div
          className={
            auth.user_id === props.user.id || props.user.id === 0
              ? "hidden"
              : "form-check"
          }
        >
          <input
            className="form-check-input"
            type="checkbox"
            id="remove"
            name="remove"
            onChange={toggleRemoveUser}
            checked={state.user.removeUser}
          />
          <label className="form-check-label" htmlFor="remove">
            {t("Verwijder gebruiker")}
          </label>
        </div>
      </form>
    </div>
  );
});

export default Edituser;
