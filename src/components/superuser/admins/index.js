import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import apiCall from "../../api";
import $ from "jquery";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../../utils";
import LeftMenu from "../../dashboard/leftmenu";
import Modal from "../../modal";
import Edituser from "./edituser.js";
import t from "../../translate";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

//functie die lijst opmaakt met users
const ListItems = props => {
  function searchOrg(organisations, organisation_id) {
    let organisation = "onbekend";

    organisations.forEach(org => {
      if (org.id === organisation_id) {
        organisation = org.name;
        return;
      }
    });
    return organisation;
  }

  const viewUser = user => {

    //rights checken
    if (typeof user.rights !== 'object' || user.rights !== 'null' || typeof user.rights.config_access === 'undefined')
    {
      user.rights = {
        config_access: false, 
        coaches_access: false,
        data_access: false,
      }
    }
    props.setStateCallback(user, t("Wijzigen gebruiker"));
    $("#user_edit").modal("toggle");
  };

  return (
    <tbody>
      {props.state.users.map(user => {
        return (
          <tr
            key={user.id}
            className="pointer rowHover"
            onClick={() => viewUser(user)}
          >
            <td>{user.id}</td>
            <td>{user.login}</td>
            <td>
              {user.firstname} {user.insertion} {user.lastname}
            </td>
            <td>
              {searchOrg(props.state.organisations, user.organisation_id)}
            </td>
            <td>{user.type}</td>
            <td>{user.email}</td>
            <td>{user.phone}</td>
          </tr>
        );
      })}
    </tbody>
  );
};

const Users = () => {
  //deze functie wordt als property doorgegeven aan modal en vandaar naar editUser
  //en aangeroepen na een geslaagde saveUser
  const closeModal = msg => {
    $("#user_edit").modal("toggle");
    setMessage(msg);
    getAdmins();
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const [state, setState] = useState({
    users: [],
    organisations: [],
    modalState: {
      name: "user_edit",
      label: "user_edit_label",
      title: "",
      component: Edituser,
      btnValue: t("Opslaan"),
      componentData: {
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
        closeModal: closeModal
      }
    }
  });

  const [message, setMessage] = useState("");
  const auth = useSelector(state => state.auth);

  const getAdmins = () => {
    //api aanroepen
    apiCall({
      action: "get_admins",
      token: auth.token,
      data: {}
    }).then(resp => {
      const newState = getClone(state);
      newState.users = resp.users;
      newState.organisations = resp.organisations;
      newState.modalState.componentData.organisations = resp.organisations;
      setState(newState);
    });
  };

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {
    getAdmins();
  }, []);

  //deze functie wordt aangeroepen bij aanklikken van een user in de list (ListItems)
  const setStateCallback = (user, title) => {
    let newState = getClone(state);
    newState.modalState.componentData.user = user;
    newState.modalState.title = title;
    setState(newState);
  };

  const addUser = () => {
    setStateCallback(
      {
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
          data_access: false
        }
      },
      t("Toevoegen gebruiker")
    );
    $("#user_edit").modal("toggle");
    $("#firstname").focus();
  };

  return (
    <div className="whiteWrapper">
      <LeftMenu />
      <div className="container dashboard_container">
        <h2>
          <i className="fas fa-users"></i> {t("Gebruikers")} &nbsp; 
          <button className="btn btn-primary btn-sm btn-trans float-right" onClick={addUser}>
            {t("Toevoegen")}
          </button>
        </h2>

        <div
          className={message.length < 1 ? "hidden" : "alert alert-success"}
          role="alert"
        >
          {message}
        </div>
 
        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t("Gebruikersnaam")}</th>
              <th scope="col">{t("Naam")}</th>
              <th scope="col">{t("Organisatie")}</th>
              <th scope="col">{t("Type")}</th>
              <th scope="col">{t("Email")}</th>
              <th scope="col">{t("Telefoon")}</th>
            </tr>
          </thead>
          <ListItems state={state} setStateCallback={setStateCallback} />
        </table>
      </div>

      <Modal {...state.modalState} />
    </div>
  );
};

export default Users;
