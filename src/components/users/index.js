import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import apiCall from "../api";
import $ from 'jquery';
import 'popper.js/dist/popper'; //als package geinstalleerd
import 'bootstrap/dist/js/bootstrap'; //als package geinstalleerd
import { getClone } from "../utils";
import Modal from "../modal";
import Edituser from "../users/edituser.js";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

let renderCount = 0;

//functie die lijst opmaakt met users
const ListItems = (props) => {

    function searchOrg(organisations, organisation_id) {  
        let organisation = "onbekend";

        organisations.forEach(org => {
            if (org.id === organisation_id)
            {
                organisation = org.name;
                return;
            }
        })
        return organisation;
    } 

    const viewUser = (user) => {
        props.setStateCallback(user);
        $('#user_edit').modal('toggle');
    }

    return (
        <tbody>
            {props.state.users.map(user => {
                return (
                    <tr key={user.id} className="pointer rowHover" onClick={() => viewUser(user)}>
                        <td>{user.id}</td>
                        <td>{user.login}</td>
                        <td>{user.firstname} {user.insertion} {user.lastname}</td>
                        <td>{searchOrg(props.state.organisations, user.organisation_id)}</td>
                        <td>{user.type}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                    </tr>
                )
            })}            
        </tbody>
    )
}

const Users = () => {

    const user = useSelector(state => state.user);

    //deze functie wordt als property doorgegeven aan modal en vandaar naar editUser
    //en aangeroepen na een geslaagde saveUser
    const closeModal = () => {
        $('#user_edit').modal('toggle');
        getUsers();
    }

    const [state, setState] = useState({
        users: [],
        organisations: [],
        modalState: {
            name: "user_edit",
            label: "user_edit_label",
            title: "Wijzigen gebruiker",
            component: Edituser,
            btnValue: "Opslaan",
            //clickHandler: saveUser,
            componentData: {
                user: {

                },
                organisations: [],
                closeModal: closeModal,
            }
        }
    });

    const auth = useSelector(state => state.auth);

    const getUsers = () => {
        //api aanroepen
        getUsersApi(auth.token).then(resp => {
            if (resp.error === 0)
            {
                if (resp.get_users === true)
                {
                    let newState = getClone(state);
                    newState.users = resp.users;
                    newState.organisations = resp.organisations;
                    newState.modalState.componentData.organisations = resp.organisations;
                    setState(newState);
                }
                else
                {
                    alert(resp.message);
                }
            }
            else
            {
                //API action: login_token, geeft error message
                alert("eeort" + resp.error); //todo
            }
        }).catch(() => {
            //fout bij aanroep van API
            alert("something went wrong..."); //todo
        });

    }

    //onFirstRenderOnly to prevent infinite render loop -> useDispatch leidt tot re-render
    if (renderCount < 1)
    {
        getUsers();
    }
    renderCount++;

    //deze functie wordt aangeroepen bij aanklikken van een user in de list (ListItems)
    const setStateCallback = (user) => {
        let newState = getClone(state);
        newState.modalState.componentData.user = user;
        setState(newState);
    } 

    return (

        <div className="whiteWrapper">
            <div className="container dashboard_container">

                <h1><i className="fas fa-users"></i> {t("Gebruikers")}</h1>

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
        
    )
}

export default Users;

//alle gebruikers ophalen
function getUsersApi(token) {

    let apiMsg = {
        action: 'get_users',
        token: token,
        data: {}
    }
  
    return new Promise((resolve, reject) => {
  
        apiCall(apiMsg).then(resp => {
          try {
            resolve(JSON.parse(resp));
          } catch(e) {
            resolve(false); //todo nonvalid json
          }
            resolve(resp);
        }).catch(() => {
            resolve(false);
        });
    });
  
  }
