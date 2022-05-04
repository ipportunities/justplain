import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import $ from "jquery";
import { useLocation } from "react-router-dom";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../utils";
import SortObjectArray from "../helpers/sortObjectArray.js";
import LeftMenu from "../dashboard/leftmenu";
import Modal from "../modal";
import Editcoach from "./edituser.js";
import t from "../translate";
import { setIntervention } from "../../actions";
import { useHistory } from "react-router-dom";
import {appSettings} from "../../custom/settings";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const InterventionCoaches = (props) => {

  let location = useLocation();
  let history = useHistory();

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
      props.setStateCallback(user, t("Wijzigen coach"));
      $("#user_edit").modal("toggle");
    };

    let coaches = state.users

    let searchForLowerCase = searchFor.toLowerCase()
    for (let i = 0; i < coaches.length; i++) {
      let name = coaches[i].firstname + " " + coaches[i].insertion +  " " + coaches[i].lastname ;
      if (!name.toLowerCase().includes(searchForLowerCase) && !coaches[i].login.toLowerCase().includes(searchForLowerCase) && !coaches[i].email.toLowerCase().includes(searchForLowerCase) && !coaches[i].id.toLowerCase().includes(searchForLowerCase)) {
          coaches[i].hide = 'true'
      } else {
        coaches[i].hide = 'false'
      }
    }

    if(sort != ""){
      coaches.sort(SortObjectArray(sort, sortDirection));
    }

    return (
      <tbody>
        {coaches.map(coach => {
          let superVisorName = "";
          let superVisorObject = props.state.users.find(u => {
            return u.id === coach.hasSupervisor;
          });
          if (superVisorObject) {
            superVisorName =
              superVisorObject.firstname +
              " " +
              superVisorObject.insertion +
              " " +
              superVisorObject.lastname;
          }
          return (
            <tr
              key={coach.id}
              className={"pointer rowHover" + (coach.hide == 'true' ? ' hide':'')}
              onClick={() => viewUser(coach)}
            >
              <td>{coach.id}</td>
              <td>{coach.login}</td>
              <td>
                {coach.firstname} {coach.insertion} {coach.lastname}{" "}
                {coach.isSupervisor ? "(" + t("Supervisor") + ")" : ""}
              </td>
              <td>{superVisorName}</td>
              <td>
                {coach.type} {coach.isSupervisor ? "/ " + t("supervisor") : ""}
              </td>
              <td>{coach.email}</td>
              <td>{coach.phone}</td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  //deze functie wordt als property doorgegeven aan modal en vandaar naar editUser
  //en aangeroepen na een geslaagde saveUser
  const closeModal = (msg, intervention_id) => {
    $("#user_edit").modal("toggle");
    setMessage(msg);
    getUsers(intervention_id);
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const dispatch = useDispatch();

  const [state, setState] = useState({
    users: [],
    organisations: [],
    modalState: {
      name: "user_edit",
      label: "user_edit_label",
      title: "",
      component: Editcoach,
      btnValue: t("Opslaan"),
      componentData: {
        coaches: [], //coaches van deze org maar niet gekoppeld aan interventie
        supervisors: [], //supervisors voor deze cursus
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
          rights: {},
          preferences: {},
          removeUser: false,
          isSupervisor: false,
          hasSupervisor: 0,
          hasCoaches: false, //hangen er coaches onder deze supervisor?
          hasStudents: false, //hangen er students onder deze coach
          max_students: 0,
          bio: '',
          languages: [],
          bioTranslations: [],
          profile_pic: ''
        },
        organisations: [],
        closeModal: closeModal
      }
    }
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);


  const getUsers = (intervention_id) => {
    //api aanroepen
    apiCall({
      action: "get_coaches",
      token: auth.token,
      data: {
        intervention_id: intervention_id
      }
    }).then(resp => {
      const newState = getClone(state);
      newState.users = resp.users;
      newState.organisations = resp.organisations;
      newState.modalState.componentData.organisations = resp.organisations;
      newState.modalState.componentData.coaches = resp.non_users;
      newState.modalState.componentData.supervisors = [];
      resp.users.map(user => {
        if (user.isSupervisor) {
          newState.modalState.componentData.supervisors.push(user);
        }
      });
      setState(newState);
    });
  };

  const [interventions, setInterventions] = useState([])

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {
    if(props.interventions != ""){
      setInterventions(props.interventions)
    }

    let intervention_id = location.pathname.split("/")[3];
    if (intervention.id === 0 || intervention_id !== intervention.id) {
      getInterventionSettings(intervention_id)
    } else {
      getUsers(intervention_id);
    }
  }, [props]);

  const getInterventionSettings = (intervention_id) => {
    apiCall({
      action: "get_intervention_settings",
      token: auth.token,
      data: {
        intervention_id,
        language_id: uiTranslation.language_id
      }
    })
      .then(resp => {
        dispatch(
          setIntervention(
            resp.intervention_id,
            resp.organisation_id,
            resp.title,
            resp.settings
          )
        );
      })
      .then(() => {
        getUsers(intervention_id);
      });
  }


  //deze functie wordt aangeroepen bij aanklikken van een user in de list (ListItems)
  const setStateCallback = (user, title) => {
    let newState = getClone(state);
    newState.modalState.componentData.user = user;
    newState.modalState.title = title;
    if(user.firstname){
        newState.modalState.title = t("Wijzig coach") + " " + user.firstname + " " + user.insertion + " " + user.lastname;
    }
    newState.modalState.componentData.user.hasCoaches = false;
    if (user.isSupervisor) {
      //hangen er coaches onder deze supervisor?
      state.users.map(coach => {
        if (coach.rights.interventions !== undefined) {
          coach.rights.interventions.map(int => {
            if (int.id === intervention.id && int.hasSupervisor === user.id) {
              newState.modalState.componentData.user.hasCoaches = true;
            }
          });
        }
      });
    }
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
        organisation_id: intervention.organisation_id,
        type: "coach",
        login: "",
        password: "",
        password_check: "",
        rights: {
          interventions: {
            id: intervention.id,
            isSupervisor: false,
            hasSupervisor: 0,
            max_students: 0,
            bio: '',
            languages: [],
            bioTranslations: [],
          }
        },
        preferences: {},
        isSupervisor: false,
        hasSupervisor: 0,
        max_students: 0,
        bio: '',
        languages: [],
        bioTranslations: [],
      },
      t("Toevoegen coach")
    );
    $("#user_edit").modal("toggle");
    $("#firstname").focus();
  };

  const searchView = () => {
    setOpenSearch(true)
  }

  const [openSearch, setOpenSearch] = useState(false)
  const [searchFor, setSearchFor] = useState("")
  const [sort, setSort] = useState("")
  const [sortDirection, setSortDirection] = useState("")

  function changeSort(type){
    setSortDirection(sortDirection == "asc" ? "desc":"asc")
    setSort(type)
  }

  //// dit zou natuurlijk ook hoger kunnen in de componenten tree opdat je slechts enkel 1 keer een aanroep hoeft te doen maar dat geldt voor alle api calls
  function changeIntervention(int_id){
    let this_intervention_obj = interventions.filter(function (intervention) {
      return intervention.id === int_id
    });
    if(this_intervention_obj.length != 0){

      history.push("/intervention/coaches/" + int_id)
      getInterventionSettings(int_id)
    }

  }

  return (
      <div className={"coachInterface coaches" + (openSearch ? ' openSearch':'') + " " + auth.userType}>
      <nav className="navbar navbar-expand-lg navbar-light">

          {auth.userType == 'admin' ?
            <h2>
              <span className="pointer" onClick={()=>history.push("/intervention/edit/" + intervention.id + "/general/")} >{" " + intervention.title + " "}</span>
            </h2>
          :
            <h2 className='select'>
              <select value={intervention.id} onChange={(e) => changeIntervention(e.target.value)}>
                {interventions.map((int, index) => (
                  <option value={int.id} key={index}>
                    {int.title}
                  </option>
                ))}
              </select>
              {intervention.title}
            </h2>
          }
        <h2 className="noPadding">
           &nbsp; > coaches
        </h2>
      </nav>
      <LeftMenu />
      <div className="list listHidden">
        <table className="theIntervention">
          <tbody>
            <tr>
              <td>
                <h2>{t(appSettings.begeleiderNameMeervoud)} {intervention.title}</h2>
              </td>
              <td className="options">
                {!appSettings.included ?
                  <button className="btn btn-primary btn-sm btn-trans" onClick={addUser}>
                    <i className="fas fa-plus"></i>
                  </button>
                 :false }

                <i className={"fas fa-search pointer" + (openSearch ? ' hide':' ')} onClick={()=>searchView()}></i>
                <div className="search">
                  <input type="text" value={searchFor} placeholder={t("Zoek coach")} onChange={(e) => setSearchFor(e.target.value)}/>
                  <i className="far fa-times-circle pointer" onClick={()=>setOpenSearch(false)}></i>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="holder">
          <div className='users'>
            <table>
              <thead>
                <tr>
                  <th className="pointer" onClick={() => changeSort("id")}>#</th>
                  <th className="pointer" onClick={() => changeSort("login")}>{t("Gebruikersnaam")}</th>
                  <th className="pointer" onClick={() => changeSort("firstname")}>{t("Naam")}</th>
                  <th className="pointer" onClick={() => changeSort("isSupervisor")}>{t("Supervisor")}</th>
                  <th>{t("Type")}</th>
                  <th className="pointer" onClick={() => changeSort("email")}>{t("Email")}</th>
                  <th className="pointer" onClick={() => changeSort("phone")}>{t("Telefoon")}</th>
                </tr>
              </thead>
              <ListItems state={state} setStateCallback={setStateCallback} />
            </table>
          </div>
        </div>
      </div>

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

      <Modal {...state.modalState} />
    </div>
  );
};

export default InterventionCoaches;
