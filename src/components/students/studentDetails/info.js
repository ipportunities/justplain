import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import Modal from "../../modal";
import Edituser from "../edituser.js";
import { getClone, calcAgeByTimestamp } from "../../utils";
import apiCall from "../../api";
import t from "../../translate";
import $ from "jquery";
import standardAvatar from "../../../images/course/standard/avatar.png";
import {appSettings} from "../../../custom/settings";
import {getProfileImage} from "../../helpers/images";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const  StudentDetailsInfo = props => {

    const url = useSelector(state => state.url);
    const closeModal = msg => {
        getImage();
        $("#user_edit").modal("toggle");
        setMessage(msg);
        //getUsers()
        setTimeout(() => {
          setMessage("");
        }, 5000);
      };

      const [image, setImage] = useState("");
      const [message, setMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");

    const [state, setState] = useState({
    modalState: {
        name: "user_edit",
        label: "user_edit_label",
        title: '',
        component: Edituser,
        btnValue: t("Opslaan"),
        componentData: {
            user: {
                id: 0,
                date_time_create: "1970-01-01 00:00:00",
                firstname: "",
                insertion: "",
                lastname: "",
                email: "",
                phone: "",
                date_time_birth: 0,
                gender: "",
                education: "",
                organisation_id: 0,
                type: "",
                login: "",
                password: "",
                password_check: "",
                removeUser: false,
                anonymous: 0
            },
            closeModal: closeModal,
        }
    }
    });




    useEffect(() => {
        if(props.user != ""){
          const newState = getClone(state);
          newState.modalState.componentData.user = props.user;
          if(props.user.firstname){
              newState.modalState.title = t("Wijzig profiel") + " " + props.user.firstname + " " + props.user.insertion + " " + props.user.lastname;
          }
          setState(newState);
          getImage();
        }

    }, [props]);

    const editUser = user => {
        $("#user_edit").modal("toggle");
      };

      const getImage = () => {
        if(state.modalState.componentData.user.profile_pic == ""){
          setImage(standardAvatar);
        } else {
          setImage(url+"/uploads/user/"+ state.modalState.componentData.user.id + "/" + state.modalState.componentData.user.profile_pic + "?" + new Date().getTime())
        }
      }

    return (
        <div>
            <div className="studentDetailsInfoPersonal">
                <div className={message.length < 1 ? "hidden" : "alert alert-success"} role="alert">
                    {message}
                </div>
                <div className={errorMessage.length < 1 ? "hidden" : "alert alert-danger"} role="alert">
                    {errorMessage}
                </div>
                {/*<em>{moment(state.modalState.componentData.user.date_time_create).format('MM-DD-YYYY h:mm ')}</em><br />*/}
                <div className="fields">
                <div className='image' style={{ backgroundImage: "url("+image+")" }}>
                </div>
                <div className='field name'>
                    {
                    (state.modalState.componentData.user.anonymous === 1) ?
                      <>{state.modalState.componentData.user.login}</>
                      :
                      <>
                        {state.modalState.componentData.user.firstname} {state.modalState.componentData.user.insertion} {state.modalState.componentData.user.lastname}
                      </>
                    }
                </div>
                <div className='field'>
                    ({state.modalState.componentData.user.login})
                    {appSettings.profileAge || appSettings.profileSexe ?
                    <>
                    , {appSettings.profileSexe ?
                        <>{state.modalState.componentData.user.gender == 'M' ? t("Man") : t("Vrouw")}</>
                        :<></>
                    } {
                      (parseInt(state.modalState.componentData.user.date_time_birth) !== 0) && appSettings.profileAge ?
                        <>
                          , {calcAgeByTimestamp(state.modalState.componentData.user.date_time_birth * 1000)} {t("jaar")}
                        </>
                        : <></>
                    }
                    </>
                    :<></>}
                </div>


                {appSettings.profileEducation ?
                    <div className='field'>
                        {t("Opleiding")}: {state.modalState.componentData.user.education}<br />
                    </div>
                    :
                    <></>
                }
                <br/>
                <div className={(state.modalState.componentData.user.anonymous === 1) ? 'hidden' : 'field'}>
                    <i className="far fa-envelope"></i> <a href={"mailto:"+state.modalState.componentData.user.email}>{state.modalState.componentData.user.email}</a>
                </div>
                {state.modalState.componentData.user.phone != "" ?
                  <div className='field'>
                    <i className="fas fa-phone"></i> <a href={"tel:"+state.modalState.componentData.user.phone}>{state.modalState.componentData.user.phone}</a>
                  </div>
                :''}

                </div>
                {!appSettings.included ?
                  <>
                      <br /><br />
                      <span className={(state.modalState.componentData.user.anonymous === 1) ? 'hidden' : 'btn btn-primary'} onClick={() => editUser(state.modalState.componentData.user)}>{t("Wijzig profiel")}</span>
                  </>
                  :''}

            </div>
            <div className="studentDetailsInfoLog">

            </div>
            <div className="studentDetailsInfoMail">

            </div>
            <Modal {...state.modalState} />
        </div>
    )
}

export default StudentDetailsInfo;
