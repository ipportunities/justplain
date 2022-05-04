import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from "react";
import { useSelector } from "react-redux";
import apiCall from "../api";
import { validateFields, getClone } from "../utils";
import t from "../translate";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import ConfirmBox from "../alert/confirm";
import DatePicker from "../content/front/parts/datepicker.js";
import standardAvatar from "../../images/course/standard/avatar.png";
import {appSettings} from "../../custom/settings";
import { Dutch } from "flatpickr/dist/l10n/nl.js";


let teller = 0;
const Edituser = forwardRef((props, ref) => {
  teller++;
  const [state, setState] = useState({
    user: {
      id: 0,
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
      rights: {},
      preferences: {},
      removeUser: false
    },
    showPassword: false
  });

  const [errorMessage, setErrorMessage] = useState("");

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const [interventions, setInterventions] = useState([])
  const [coachesPerIntervention, setCoachesPerIntervention] = useState([])
  const [groupsPerIntervention, setGroupsPerIntervention] = useState([])
  const url = useSelector(state => state.url);
  const [profileImage, setProfileImage] = useState('');

  const [activeTab, setActiveTab] = useState(1)
  const [isSupervisorIntervention, setIsSupervisorIntervention] = useState(false)

  //////////////////////
  ///Upload image to server
  const uploadImage = (uploadedFiles) => {
    let promises = [];
    let files = [];
    Array.from(uploadedFiles).forEach(uploadFile => {
      let filePromise = new Promise(resolve => {
        let reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onload = e => {
          let file = {};
          file.type = uploadFile.type;
          file.name = 'profile_pic.' + uploadFile.name.split('.').pop();
          file.size = uploadFile.size;
          file.content = e.target.result;
          files.push(file);
          resolve(true);
        };
      });
      promises.push(filePromise);
    });

    Promise.all(promises).then(fileContents => {
      let apiObj = {
        action: "upload_coach_image",
        token: auth.token,
        data: {
          user_id: state.user.id,
          files: files
        }
      };

      apiCall(apiObj).then(resp => {
        if (resp) {
          if(resp.error == 0){
            setProfileImage(resp.image);
            updateImageInview(resp.image)
          }
        }
      });
    });
  }

  function updateImageInview(image = false){
    const newState = {...state}
    newState.user.profile_pic = image;
    setState(newState);
    setErrorMessage("");
  }

    //////////////////////
  ///Delete image from server
  const deleteImage = (e, name) => {
    e.stopPropagation();

    let apiMsg = {
      action: "delete_coach_image",
      token: auth.token,
      data:{
        user_id: state.user.id
      }
    };

    apiCall(apiMsg).then(resp => {
      if (false !== resp) {
        if (resp.error == 0) {
          setProfileImage('');
          updateImageInview('')
        }
      }
    });
  }

  let inputFileRef = React.createRef();
  const triggerInputFile = () => {
    inputFileRef.current.click();
  }

  //laden state met data uit props
  useEffect(() => {
    if(intervention.id > 0){
      if(isSupervisor(intervention.id)){
        setIsSupervisorIntervention(true)
      }
    }
  }, [intervention]);

  //laden state met data uit props
  useEffect(() => {
    //api aanroepen
    apiCall({
      action: "get_interventions",
      token: auth.token,
      data: {}
    }).then(resp => {
      ////filter interventions of coach
      let respInterventions = [];
      if(auth.userType == "coach"){
        for(let i = 0 ; i < resp.interventions.length ; i++){
          if(isCoachOfIntervention(resp.interventions[i].id)){
            respInterventions.push(resp.interventions[i]);
          }
        }
      } else {
        respInterventions = resp.interventions;
      }
      setInterventions(respInterventions)

      ///TODO api interference als deze nog niet geupdate is
      if(resp.coaches_per_intervention){
        setCoachesPerIntervention(resp.coaches_per_intervention)
      }
      if(resp.groups_per_intervention){
        setGroupsPerIntervention(resp.groups_per_intervention)
      }

    });
  }, []);

  useEffect(() => {
    const newState = {...state}
    newState.user = props.user;
    newState.user.password = "";
    newState.user.password_check = "";
    newState.types = ["student"];
    if (newState.user.id == 0) {
      newState.showPassword = true;
    } else {
      newState.showPassword = false;
    }
    newState.user.removeUser = false;

    setState(newState);
    setErrorMessage("");
    setErrorFields([])
    setProfileImage(newState.user.profile_pic);
  }, [props.user]);

  const onChange = e => {
    setErrorMessage('');
    //state wijzigen
    const newState = {...state}
    newState.user[e.target.name] = e.target.value;
    setState(newState);
    setErrorMessage("");
  };

  const toggleShowPassword = e => {
    const newState = {...state}
    //state wijzigen
    if (newState.showPassword) {
      newState.showPassword = false;
    } else {
      newState.showPassword = true;
    }
    setState(newState);
  };

  const toggleRemoveUser = e => {
    const newState = {...state}
    //state wijzigen
    if (newState.user.removeUser) {
      newState.user.removeUser = false;
    } else {
      newState.user.removeUser = true;
    }
    setState(newState);
  }

  const [confirmOptions, setConfirmOptions] = useState({});
  const [toDeleteIndex, setToDeleteIndex] = useState(-1); /// doet niks maar is nodig in ingeladen custom confirm
  const [deleteUser, setDeleteUser] = useState(false);

  function deleteConfirm() {
    let confirmOptionsToSet = {
      show: "true",
      text: "<h4>"+t("Weet u zeker dat u deze deelnemer wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => doDeleteUser()
    };
    //setToDeleteIndex(-1);
    setConfirmOptions(confirmOptionsToSet);
  }

  function doDeleteUser(){

    //indien verwijderen, is dit de enige interventie waaraan de student is gekoppeld?
    if (state.user.removeUser && state.user.rights.interventions.length > 1) {
      //zo ja, dan alleen deelnemer loskoppelen van deze interventie
      let intervention_index = 0;
      //zo ja, dan alleen coach loskoppelen van deze interventie
      state.user.rights.interventions.map((interv, index) => {
        if (intervention.id == interv.id) {
          intervention_index = index;
        }
      });
      state.user.rights.interventions.splice(intervention_index, 1);
      state.user.removeUser = false;
    }

    apiCall({
      action: "save_user",
      token: auth.token,
      data: {
        user: state.user
      }
    }).then(resp => {
      state.selectedCoach = 0;
      props.closeModal(resp.msg, intervention.id);


    });
  }


  //deze functie wordt aangeroepen door button in component Modal -> ref functie koppelt
  //componenten aan elkaar
  useImperativeHandle(ref, () => ({
    cancelHandler(){
      setErrorMessage('');
      props.closeModal('', intervention.id);

    },
    submitHandler() {
      setErrorMessage('');
      //nee
      if (state.user.removeUser) {
        if (deleteConfirm() != 'true'
        ) {
          return;
        }
      }
      /*
      //indien verwijderen, is dit de enige interventie waaraan de student is gekoppeld?
      if (state.user.removeUser && state.user.rights.interventions.length > 1) {
        //zo ja, dan alleen deelnemer loskoppelen van deze interventie
        state.user.rights.interventions = state.user.rights.interventions.filter(
          function(value, index, arr) {
            return value != intervention.id;
          }
        );
        state.user.removeUser = false;
      }
      */

      //tijdelijk om hasCoach aan rechten toe te voegen:
      /// waarom staat deze uit..... 2022-2-17
      if (state.user.rights.interventions.length > 0) {
        for (var key in state.user.rights.interventions) {
          if (!state.user.rights.interventions[key].hasOwnProperty("hasCoach")) {
            if(auth.userType == "coach"){
              	state.user.rights.interventions[key].hasCoach = auth.user_id;
            }
          }
        }
      }

      ///4-10-2021 validating js
      let validation = validateFields(formValidationSettings, state.user);
      setErrorFields(validation.errorFields)
      if(validation.errorFields.includes("password") && validation.errorFields.includes("password_check") && validation.errorFields.length == 2){
        setActiveTab(3);
      } else if (validation.errorFields.length > 0){
        setActiveTab(1);
      }
      if(!validation.status){
        setErrorMessage(validation.msg);
      } else {
        if(checkIfCoachesANdGroupsAreSet()) {
          apiCall({
            action: "save_user",
            token: auth.token,
            data: {
              user: state.user
            }
          }).then(resp => {
            props.closeModal(resp.msg, intervention.id);
          });
        }
      }

    }
  }));

  ////tbv validating en nette error afhandeling
  const [errorFields, setErrorFields] = useState([]);
  const formValidationSettings = [
    {
      "name":"firstname",
      "text":"Voornaam",
      "validate":"required",
    },{
      "name":"lastname",
      "text":"Achternaam",
      "validate":"required",
    },{
      "name":"email",
      "text":"E-mail",
      "validate":"required|email",
      "error":"Email adres is niet geldig",
    }, {
      "name":"phone",
      "text":"Telefoonnummer",
      "validate":"required|phone",
      "error":"Telefoonnummer is niet geldig",
    },{
      "name":"login",
      "text":"Gebruikersnaam",
      "validate":"required",
    },{
      "name":"password",
      "text":"Wachtwoord",
      "validate":"newpassword",
    }
  ]

  function checkIfCoachesANdGroupsAreSet(){
    let coacherAreSet = true
    for(let i = 0 ; i<state.user.rights.interventions.length ; i++) {
      if(!state.user.rights.interventions[i].hasOwnProperty("hasCoach") || !Number.isInteger(parseInt(state.user.rights.interventions[i].hasCoach)) || parseInt(state.user.rights.interventions[i].hasCoach) < 1) {
        //coach niet gezet...
        coacherAreSet = false
      }

      ///check of groep is gezet indien chatcourse
      let interventionToCheck = interventions.find(interv => parseInt(state.user.rights.interventions[i].id));
      if(interventionToCheck.settings.intervention_type == 'chatcourse'){
        if (coacherAreSet && (!state.user.rights.interventions[i].hasOwnProperty("group_id") || !Number.isInteger(parseInt(state.user.rights.interventions[i].group_id)) || parseInt(state.user.rights.interventions[i].group_id) < 1)) {
          //groep niet gezet...
          coacherAreSet = false
        }
      }

    }
    if(!coacherAreSet) {
      setActiveTab(2)
      setErrorMessage(t("Geef voor alle interventies waartoe deze deelnemer toegang heeft aan onder welke coach of groep zij vallen."));
    }
    return coacherAreSet;
  }

  //checkIfInterventionIsActie: checkt of ingelogde gebruiker is gekoppeld, dus rechten heeft, voor de betreffende interventie
  function checkIfInterventionIsActie(intervention_id) {
    if(typeof state.user != "undefined" && typeof state.user.rights != "undefined") {
      const tempInterventions = getClone(state.user.rights.interventions);

      let this_intervention_obj = state.user.rights.interventions.filter(function (intervention) {
        return intervention.id === intervention_id
      });

      if(this_intervention_obj.length != 0){
        return this_intervention_obj;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function setActiveInterventions(intervention_id) {

    //Deelnemer moet altijd aan minimaal 1 interventie gekoppeld blijven
    if(state.user.rights.interventions.length == 1 && checkIfInterventionIsActie(intervention_id)) { return false }
    //we gaan clonen
    const newState = {...state}
    //bepalen of deze toegevoegd of verwijderd moet worden
    let indexOfIntervention = newState.user.rights.interventions.findIndex(interv => parseInt(interv.id) === parseInt(intervention_id))
    if (-1 === indexOfIntervention) {
      //niet aangetroffen, dus toevoegen
      newState.user.rights.interventions.push({
        'id': intervention_id,
        'hasCoach': auth.user_id
      })
    } else {
      //verwijderden
      newState.user.rights.interventions.splice(indexOfIntervention, 1)
    }
    setState(newState)
  }

  const getSelectedCoachOfThisIntervention = (intervention_id) => {
    //find out user has coach allready for this course
    let coach_id = 0;
    if(typeof state.user.rights != "undefined") {
      let intervention = state.user.rights.interventions.find(function (rights) {
        return rights.id === intervention_id
      })
      if (typeof intervention !== "undefined" && intervention.hasOwnProperty("hasCoach")) {
        coach_id = intervention.hasCoach
      } else {
        coach_id = auth.user_id
      }
    }
    return coach_id
  }

  const getSelectedGroupOfThisIntervention = (intervention_id) => {
    //find out user has a group allready for this course
    let group_id = 0;
    if(typeof state.user.rights != "undefined") {
      let intervention = state.user.rights.interventions.find(function (rights) {
        return rights.id === intervention_id
      })
      if (typeof intervention !== "undefined" && intervention.hasOwnProperty("group_id")) {
        group_id = intervention.group_id
      }
    }
    return group_id
  }

  function changeCoach(intervention_id, coach_id) {
    setErrorMessage("")
    //state wijzigen
    const newState = {...state}
    state.user.rights.interventions.map((interv, index) => {
      if (parseInt(interv.id) === parseInt(intervention_id)) {
        newState.user.rights.interventions[index].hasCoach = coach_id;
      }
    })
    setState(newState)
  }

  const changeCoachGroup = (intervention_id, group_id) => {
    setErrorMessage("")
    //coach id van deze groep bepalen
    let coach_id = 0;
    groupsPerIntervention.map(interv => {
      if (parseInt(interv.intervention_id) === parseInt(intervention_id)) {
        interv.groups.map(group => {
          if (parseInt(group.id) === parseInt(group_id)) {
            coach_id = group.coach_id
          }
        })
      }
    })
    //state wijzigen
    const newState = {...state}
    state.user.rights.interventions.map((interv, index) => {
      if (parseInt(interv.id) === parseInt(intervention_id)) {
        newState.user.rights.interventions[index].hasCoach = coach_id;
        newState.user.rights.interventions[index].group_id = group_id;
      }
    })
    setState(newState)
  }

  function isCoachOfIntervention(interventionID){
    if(auth.userType == "coach"){
      let right = auth.rights.interventions.filter(function (rights) {
        return rights.id === interventionID
      });
      let thisRightIndex = auth.rights.interventions.indexOf(right[0])
      if(thisRightIndex >= 0){
        return true;
      }
    }
  }

  function isSupervisor(interventionID){
    if(auth.userType == "coach"){
      let right = auth.rights.interventions.filter(function (rights) {
        return rights.id === interventionID
      });
      let thisRightIndex = auth.rights.interventions.indexOf(right[0])
      if(thisRightIndex >= 0){
        if(auth.rights.interventions[thisRightIndex].isSupervisor == 1){
          return true;
        }
      }
    }
  }

  function setDate(intervention_id, date){
    const newState = {...state}

    let intervention_object = newState.user.rights.interventions.filter(function (rights) {
      return rights.id === intervention_id
    });
    let thisInterventionIndex = newState.user.rights.interventions.indexOf(intervention_object[0])
    if (thisInterventionIndex >= 0) {
      if(date == 'clear'){date = ''}
      newState.user.rights.interventions[thisInterventionIndex].accessible_from = date;
    }

    setState(newState)
  }

  function getAccesDate(intervention_id){
    console.log(intervention_id);
    let intervention_object = state.user.rights.interventions.filter(function (rights) {
      return rights.id === intervention_id
    });
    let thisInterventionIndex = state.user.rights.interventions.indexOf(intervention_object[0])
    if (thisInterventionIndex >= 0) {
      if(state.user.rights.interventions[thisInterventionIndex].accessible_from != ""){
        console.log(state.user.rights.interventions[thisInterventionIndex].accessible_from);
        return state.user.rights.interventions[thisInterventionIndex].accessible_from;
      }
    }
  }

  //.log("firstname: "+state.user.firstname);
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
      <div className="tabs">
        <div className={"tab" + (activeTab == 1 ? ' active':'')} onClick={()=>setActiveTab(1)}>
          <h6>{t("Personalia")}</h6>
        </div>
        {isSupervisorIntervention || auth.userType == "admin" ?
          <div className={"tab" + (activeTab == 2 ? ' active':'')} onClick={()=>setActiveTab(2)}>
            <h6>{t(appSettings.interventieNameMeervoud)}</h6>
          </div>
          :<></>}

        <div className={"tab" + (activeTab == 3 ? ' active':'')} onClick={()=>setActiveTab(3)}>
          <h6>{t("Wachtwoord")}</h6>
        </div>
        {auth.user_id === props.user.id || props.user.id === 0 ? <></>:<div className={"tab" + (activeTab == 4 ? ' active':'')} onClick={()=>setActiveTab(4)}>
          <h6>{t("Verwijderen")}</h6>
        </div>}

      </div>
      <div className="tabContent">
        <div className={"content" + (activeTab == 1 ? ' active':'')}>
        {state.user.id > 0 ?
          <>
          <div className='image_holder' style={{ backgroundImage: "url( "+ (profileImage == '' ? standardAvatar:url+"/uploads/user/"+ state.user.id + "/" + profileImage + "?" + new Date().getTime()) + ")" }}>
              <input
                type="file"
                onChange={e => uploadImage(e.target.files)}
                name="file"
                ref={inputFileRef}
                multiple={false}
              />
              <div className="options">
                <span className="btn handle">
                  <i
                    className="fas fa-camera-retro"
                    onClick={triggerInputFile}
                  ></i>
                </span>
                {profileImage != '' ?
                  <span className="btn delete">
                    <i
                      className="fas fa-trash"
                      onClick={e => deleteImage(e, profileImage)}
                    ></i>
                  </span>
                :''}
                </div>
              </div>
              <br/>
            </>
            :<></>}
          <div className="form-row align-items-center">

            <div className="col">
              <label htmlFor="firstname">{t("Voornaam")}</label>
              <input
                type="text"
                className={"form-control" + (errorFields.includes('firstname') ? ' error':'')}
                id="firstname"
                name="firstname"
                aria-describedby="firstname"
                placeholder=""
                value={state.user.firstname || ""}
                onChange={onChange}
              />
            </div>
            <div className="col ">
              <label htmlFor="insertion">{t("Tussenvoegsel")}</label>
              <input
                type="text"
                className="form-control"
                id="insertion"
                name="insertion"
                aria-describedby="insertion"
                placeholder=""
                value={state.user.insertion || ""}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <label htmlFor="lastname">{t("Achternaam")}</label>
              <input
                type="text"
                className={"form-control" + (errorFields.includes('lastname') ? ' error':'')}
                id="lastname"
                name="lastname"
                aria-describedby="lastname"
                placeholder=""
                value={state.user.lastname || ""}
                onChange={onChange}
              />
            </div>
          </div>

          {/*
            <div className="form-row align-items-center">
              <div className="col">
                <br />
                <input
                  type="radio"
                  className="form-control"
                  id="gender_f"
                  name="gender"
                  aria-describedby="gender"
                  value="F"
                  onChange={onChange}
                  checked={state.user.gender === 'F'}
                /> <label htmlFor="gender_f">{t("Vrouw")}</label>
                <input
                  type="radio"
                  className="form-control"
                  id="gender_m"
                  name="gender"
                  aria-describedby="gender"
                  value="M"
                  onChange={onChange}
                  checked={state.user.gender === 'M'}
                  /> <label htmlFor="gender_m">{t("Man")}</label>
                <br /><br />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="date_time_birth">{t("Geboortedatum")}</label><br />
              <Flatpickr
                options={{ locale: Dutch, dateFormat: "d.m.Y" }}
                value={state.user.date_time_birth * 1000}
                onChange={date => {
                  updateDateTimeBirth(date[0].getTime()/1000)
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="education">{t("Opleiding")}</label>
              <input
                type="text"
                className="form-control"
                id="education"
                name="education"
                aria-describedby="education"
                placeholder=""
                value={state.user.education || ""}
                onChange={onChange}
              />
            </div>
          */}
          <div className="form-row align-items-center">
            <div className="col-4">
              <label htmlFor="email">{t("E-mail")}</label>
              <input
                type="text"
                className={"form-control" + (errorFields.includes('email') ? ' error':'')}
                id="email"
                name="email"
                aria-describedby="email"
                placeholder=""
                value={state.user.email || ""}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <label htmlFor="phone">{t("Telefoonnummer")}</label>
              <input
                type="text"
                className={"form-control" + (errorFields.includes('phone') ? ' error':'')}
                id="phone"
                name="phone"
                aria-describedby="phone"
                placeholder=""
                value={state.user.phone || ""}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="form-row align-items-center">
            <div className="col">
              <label htmlFor="login">{t("Gebruikersnaam")}</label>
              <input
                type="text"
                className={"form-control" + (errorFields.includes('login') ? ' error':'')}
                id="login"
                name="login"
                aria-describedby="login"
                placeholder=""
                value={state.user.login || ""}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        {isSupervisorIntervention || auth.userType == "admin" ?
          <div className={"content interventions" + (activeTab == 2 ? ' active':'') + (appSettings.access_date_intervention_is_option ? ' show_header':false)}>
          {interventions.length > 0 ?
            <div className="form-group">
              <table>
                <tbody>
                  <tr>
                    <th>
                      {t(appSettings.interventieName)}
                    </th>
                    <th>
                      {t("Coach")}
                    </th>
                    <th>
                      {t("Toegankelijk vanaf")}
                    </th>
                  </tr>
                  {interventions.map((intervention, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={"intervention_" + intervention.id}
                          onChange={()=>setActiveInterventions(intervention.id)}
                          checked={checkIfInterventionIsActie(intervention.id)}
                        />
                        <label className="form-check-label" htmlFor={"intervention_" + intervention.id}>
                          {intervention.title}
                        </label>
                      </td>
                      <td>
                          {
                            //// TODO nakijken als je een nieuwe deelnemer aanmaakt buiten chatcourse krijg je foutmelding want je hebt nog geen coach!
                            //parseInt(state.user.id) !== 0 ?
                            true ?
                              <>
                                {
                                  (typeof intervention.settings.intervention_type !== "undefined" && intervention.settings.intervention_type !== 'chatcourse') ?
                                    <select onChange={(e)=>changeCoach(intervention.id, e.target.value)} value={getSelectedCoachOfThisIntervention(intervention.id)}>
                                      <option value="">Selecteer een coach</option>
                                      <>
                                        {
                                          coachesPerIntervention.length > 0 ?
                                            <>
                                              {
                                                coachesPerIntervention.filter(coaches => coaches.intervention_id === intervention.id)[0].coaches.map((coach, index) => {
                                                  return (
                                                    <option key={index} value={coach.id}>{coach.login}</option>
                                                  )
                                                })
                                              }
                                            </> : <></>
                                        }
                                      </>
                                    </select>
                                    :
                                    <>
                                    {
                                      /*getSelectedGroupOfThisIntervention(intervention.id)*/
                                    }
                                    <select onChange={(e)=>changeCoachGroup(intervention.id, e.target.value)} value={getSelectedGroupOfThisIntervention(intervention.id)}>
                                      <option value="">Selecteer een groep... {groupsPerIntervention.length} </option>
                                      <>
                                        {
                                          groupsPerIntervention.length > 0 ?
                                          <>
                                            {
                                              groupsPerIntervention.filter(groups => groups.intervention_id === intervention.id)[0].groups.map((group, index) => {
                                                return (
                                                  <option key={index} value={group.id}>#{group.id} {group.title} ({group.coach_name})</option>
                                                )
                                              })
                                            }
                                          </> : <></>
                                        }
                                      </>
                                    </select></>
                                }
                              </>
                              :
                              <>
                                {
                                  (typeof intervention.settings.intervention_type !== "undefined" && intervention.settings.intervention_type === 'chatcourse') ?
                                    <select onChange={(e)=>changeCoachGroup(intervention.id, e.target.value)}>
                                      <option value="">Selecteer een groep</option>
                                      <>
                                        {
                                          groupsPerIntervention.length > 0 ?
                                          <>
                                            {
                                              groupsPerIntervention.filter(groups => groups.intervention_id === intervention.id)[0].groups.map((group, index) => {
                                                return (
                                                  <option key={index} value={group.id}>#{group.id} {group.title} ({group.coach_name})</option>
                                                )
                                              })
                                            }
                                          </> : <></>
                                        }
                                      </>
                                    </select>
                                    :
                                    <></>
                                }
                              </>
                          }
                      </td>
                      {appSettings.access_date_intervention_is_option ?
                        <td>
                          {checkIfInterventionIsActie(intervention.id) ?
                            <>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>
                                      <Flatpickr
                                        options={{ locale: Dutch, dateFormat: "d.m.Y" }}
                                        value={getAccesDate(intervention.id)}
                                        onChange={dateChanged => {
                                          setDate(intervention.id, dateChanged)
                                        }}
                                      />
                                    </td>
                                    {getAccesDate(intervention.id) ?
                                      <td>
                                        <i className="fas fa-times" onClick={()=>setDate(intervention.id, 'clear')}></i>
                                      </td>
                                      :false}
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          :false}
                        </td>
                        :false}
                    </tr>
                  ))}
                  </tbody>
                </table>
            </div>
            :''}
          </div>
          :
          <></>
        }
        <div className={"content" + (activeTab == 3 ? ' active':'')}>
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
                className={"form-control" + (errorFields.includes('password') ? ' error':'')}
                id="password"
                name="password"
                aria-describedby="password"
                placeholder=""
                value={state.user.password || ""}
                onChange={onChange}
              />
            </div>
            <div className="col">
              <label htmlFor="login">{t("Wachtwoord ter controle")}</label>
              <input
                type="password"
                className={"form-control" + (errorFields.includes('password_check') ? ' error':'')}
                id="password_check"
                name="password_check"
                aria-describedby="password_check"
                placeholder=""
                value={state.user.password_check || ""}
                onChange={onChange}
              />
            </div>
          </div>

        </div>
        <div className={"content" + (activeTab == 4 ? ' active':'')}>
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
            {typeof state.user.rights != "undefined" && typeof state.user.rights.interventions != "undefined" && state.user.rights.interventions.length == 1 ? t("Verwijder gebruiker"):t("Ontkoppel gebruiker van deze ") + t(appSettings.interventieName.toLowerCase())}
          </label>
        </div>
        </div>
      </div>
      </form>

      <ConfirmBox confirmOptions={confirmOptions} setConfirmOptions={setConfirmOptions} setToDeleteIndex={setToDeleteIndex}/>
    </div>
  );
});

export default Edituser;
