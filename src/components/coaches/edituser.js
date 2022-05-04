import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import apiCall from "../api";
import { validateFields, getClone } from "../utils";
import t from "../translate";
import ConfirmBox from "../alert/confirm";
import {appSettings} from "../../custom/settings";

const Edituser = forwardRef((props, ref) => {
  const emptyUser =
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
      isSupervisor: 0,
      hasSupervisor: 0,
      hasCoaches: 0,
      hasStudents: false,
      max_students: 0,
      bio: '',
      languages: [],
      bioTranslations: [],
      profile_pic: '',
      rights: {},
      preferences: {},
      removeUser: false
    }
  const [state, setState] = useState({
    selectedCoach: 0,
    user: emptyUser,
    coaches: [],
    supervisors: [],
    organisations: [],
    types: [],
    showPassword: false
  });

  const [addNewUser, setAddNewUser] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImage, setProfileImage] = useState('');

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const url = useSelector(state => state.url);
  const [languages, setLanguages] = useState([]);

  const [activeTab, setActiveTab] = useState(1)

  //laden state met data uit props
  useEffect(() => {
    const newState = getClone(state);
    newState.user = props.user;
    newState.user.password = "";
    newState.user.password_check = "";
    newState.organisations = props.organisations;
    newState.coaches = props.coaches;
    newState.supervisors = props.supervisors;
    newState.types = ["coach"];
    if (newState.user.id == 0) {
      newState.showPassword = true;
    } else {
      newState.showPassword = false;
    }
    newState.user.removeUser = false;
    //temp tbv nieuwe parameter
    if (typeof newState.user.languages === "undefined")
    {
      newState.user.languages = [];
    }
    if (typeof newState.user.bioTranslations === "undefined")
    {
      newState.user.bioTranslations = [];
    }
    //
    setState(newState);
    setProfileImage(newState.user.profile_pic);
    setErrorMessage("");
    setErrorFields([]);
    setActiveTab(1)
    if(props.user.id > 0){
        setAddNewUser(false);
    } else {
      setAddNewUser(true);
    }

    //api aanroepen, talen ophalen
    apiCall({
      action: "get_languages",
      token: auth.token,
      data: {}
    }).then(resp => {
      setLanguages(resp.languages);
    });
  }, [props.user]);

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
          }
        }
      });
    });
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
        }
      }
    });
  }

  let inputFileRef = React.createRef();
  const triggerInputFile = () => {
    inputFileRef.current.click();
  }

  const onChange = e => {
    //e.preventDefault(); // misschien heeft deze wel een functie maar hij blokt de checkbox toggle checked unchecked
    const newState = getClone(state);
    if(!(e.target.name == "bioTranslations" || e.target.name == "languages")){
        newState.user[e.target.name] = e.target.value;
    } else if(e.target.name == "bioTranslations"){
      let bioTranslations = newState.user.bioTranslations.filter(function (translation) {
        return translation.code === e.target.dataset.code
      });
      if(bioTranslations.length > 0){
        newState.user.bioTranslations[newState.user.bioTranslations.indexOf(bioTranslations[0])]['content'] = e.target.value
      } else {
        newState.user.bioTranslations.push({"code":e.target.dataset.code,"content":e.target.value})
      }
    } else if(e.target.name == "languages"){
      if(newState.user.languages.includes(e.target.value)){
        let indexOfLanguage = newState.user.languages.indexOf(e.target.value);
        newState.user.languages.splice(indexOfLanguage, 1);
      } else {
        newState.user.languages.push(e.target.value)
      }
    }

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

    //als dit de enige supervisor coach is van deze interventie dan mag deze niet worden verwijderd,
    //ook als er andere coaches onder deze coach hangen mag het niet
    if (!newState.user.removeUser && newState.user.isSupervisor) {
      //check invoegen, dit mag alleen als er geen andere coaches onderhangen...
      if (!newState.user.hasCoaches) {
        //en als er andere supervisors zijn...
        let otherSupervisors = false;
        state.supervisors.map(supervisor => {
          if (supervisor.id !== state.user.id) {
            otherSupervisors = true;
          }
        });
        if (otherSupervisors) {
          //newState.user.isSupervisor = 0;
        } else {
          setErrorMessage(
            t(
              "Dit is de enige coach die ook supervisor is voor deze interventie, u kunt deze daarom niet verwijderen."
            )
          );
          return false;
        }
      } else {
        setErrorMessage(
          t(
            "Aangezien er nog coaches aan deze supervisor zijn gekoppeld kunt u deze niet verwijderen."
          )
        );
        return false;
      }
    }

    //zijn er nog studenten gekoppeld aan deze coach?
    if (newState.user.hasStudents)
    {
      setErrorMessage(
        t(
          "Er zijn nog studenten gekoppeld aan deze coach, u kunt deze daarom niet verwijderen."
        )
      );
      return false;
    }

    if (newState.user.removeUser) {
      newState.user.removeUser = false;
    } else {
      newState.user.removeUser = true;
    }
    setState(newState);
  };

  const [confirmOptions, setConfirmOptions] = useState({});
  const [toDeleteIndex, setToDeleteIndex] = useState(-1); /// doet niks maar is nodig in ingeladen custom confirm
  const [deleteCoach, setDeleteCoach] = useState(false);

  function deleteConfirm() {
    let confirmOptionsToSet = {
      show: "true",
      text: "<h4>"+t("Weet u zeker dat u deze coach wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => doDeleteCoach()
    };
    //setToDeleteIndex(-1);
    setConfirmOptions(confirmOptionsToSet);
  }

  function doDeleteCoach(){
    //console.log("doDeleteCoach");
    //console.log(state.user.rights.interventions);
    if (state.user.removeUser && state.user.rights.interventions.length > 1) {
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
    },
    submitHandler() {
      //bestaande coach koppelen aan deze interventi?
      if (state.selectedCoach != 0) {
        //ja
        let updateCoach = {};
        //let updateCoach = {
        //  rights: {
        //    interventions: []
        //  }
        //};

        if (
          !state.user.removeUser &&
          state.user.isSupervisor == 0 &&
          state.user.hasSupervisor == 0
        ) {
          setActiveTab(2)
          setErrorMessage(t("Geef aan onder welke supervisor deze coach valt!"));
          return false;
        }

        //data van betreffende coach ophalen
        for (var coach of state.coaches) {
          if (coach.id === state.selectedCoach) {
            updateCoach = coach;
            break;
          }
        }

        //rechten voor deze interventie toevoegen
        updateCoach.rights.interventions.push({
          id: intervention.id,
          isSupervisor: state.user.isSupervisor,
          hasSupervisor: state.user.hasSupervisor,
          max_students: 0,
          bio: '',
          bioTranslations: [],
          languages: []
        });
        Object.keys(updateCoach).forEach(key => {
          state.user[key] = updateCoach[key];
        });
        //state.user = updateCoach;
      } else {
        //wijzigen bestaande of toevoegen nieuwe coach
        //verwijderen?
        if (state.user.id != 0 && state.user.removeUser) {
          /// show custom confirm
          if (deleteConfirm() != 'true'
            /*!window.confirm(
              t("Weet u zeker dat u deze coach wilt verwijderen?")
            )*/
          ) {
            //props.closeModal("");
            return;
          }
        } else {
          //rechten toevoegen of aanpassen?
          if (state.user.id == 0) {
            state.user.rights.interventions = [
              {
                id: intervention.id,
                isSupervisor: state.user.isSupervisor,
                hasSupervisor: state.user.hasSupervisor,
                max_students: state.user.max_students,
                bio: state.user.bio,
                bioTranslations: state.user.bioTranslations,
                languages: state.user.languages
              }
            ];
          } else {
            state.user.rights.interventions.map((interv, index) => {
              if (intervention.id == interv.id) {
                state.user.rights.interventions[index].isSupervisor =
                  state.user.isSupervisor;
                state.user.rights.interventions[index].hasSupervisor =
                  state.user.hasSupervisor;
                state.user.rights.interventions[index].max_students =
                  state.user.max_students;
                state.user.rights.interventions[index].bio =
                  state.user.bio;
                state.user.rights.interventions[index].bioTranslations =
                  state.user.bioTranslations;
                state.user.rights.interventions[index].languages =
                  state.user.languages;
              }
            });
          }
        }
      }
      //indien verwijderen, is dit de enige interventie waaraan de coach is gekoppeld?
      /*
      ///Delete heeft zijn eigen functie
      if (state.user.removeUser && state.user.rights.interventions.length > 1) {
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
      */

      ///4-10-2021 validating js
      let validation = validateFields(formValidationSettings, state.user);
      setErrorFields(validation.errorFields)
      if(validation.errorFields.includes("password") && validation.errorFields.includes("password_check") && validation.errorFields.length == 2){
        setActiveTab(4);
      } else if (validation.errorFields.length > 0){
        setActiveTab(1);
      }
      if(!validation.status){
        setErrorMessage(validation.msg);
        return false;
      }

      //indien geen superVisor rol dan wel vallend onder supervisor?
      if (
        !state.user.removeUser &&
        state.user.isSupervisor == 0 &&
        state.user.hasSupervisor == 0
      ) {
        setActiveTab(2)
        setErrorMessage(t("Geef aan onder welke supervisor deze coach valt!"));
        return false;
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


  const selectExistingUser = e => {
    const newState = getClone(state);
    newState.selectedCoach = e.target.value;

    if(e.target.value > 0){
      newState.showPassword = false;
    } else {
      ////new user
      newState.showPassword = true;
      newState.user = emptyUser;
    }

    setState(newState);

    setErrorMessage("");


  };

  const toggleShowHasSupervisor = e => {
    setErrorMessage("")
    const newState = getClone(state);
    if (newState.user.isSupervisor) {
      //check invoegen, dit mag alleen als er geen andere coaches onderhangen...
      if (!newState.user.hasCoaches) {
        //en als er andere supervisors zijn...
        let otherSupervisors = false;
        state.supervisors.map(supervisor => {
          if (supervisor.id !== state.user.id) {
            otherSupervisors = true;
          }
        });
        if (otherSupervisors) {
          newState.user.isSupervisor = 0;
        } else {
          setErrorMessage(
            t(
              "Dit is de enige coach die ook supervisor is voor deze interventie, u kunt deze instelling daarom niet wijzigen."
            )
          );
        }
      } else {
        setErrorMessage(
          t(
            "Aangezien er nog coaches aan deze supervisor zijn gekoppeld kunt u deze instelling niet wijzigen."
          )
        );
      }
    } else {
      newState.user.isSupervisor = 1;
      newState.user.hasSupervisor = 0;
    }
    setState(newState);
  };

  const getBioTranslationContent = (code) => {
    let bioTranslations = state.user.bioTranslations.filter(function (translation) {
      return translation.code === code
    });

    if(bioTranslations.length > 0){
      return bioTranslations[0].content
    } else {
      return ''
    }
  }
  const selectSupervisor = e => {
    const newState = getClone(state);
    newState.user.hasSupervisor = e.target.value;
    setState(newState);
    setErrorMessage("");
  };

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
        <div className={"tab" + (activeTab == 2 ? ' active':'')} onClick={()=>setActiveTab(2)}>
          <h6>{t("Rol")}</h6>
        </div>
        {!addNewUser || state.selectedCoach == 0 ? <>
          <div className={"tab" + (activeTab == 3 ? ' active':'')} onClick={()=>setActiveTab(3)}>
            <h6>{t("Talen")}</h6>
          </div>
          <div className={"tab" + (activeTab == 4 ? ' active':'')} onClick={()=>setActiveTab(4)}>
            <h6>{t("Wachtwoord")}</h6>
          </div>

          </>:<></>}

          {!addNewUser ?
          <>
          {auth.user_id === props.user.id || props.user.id === 0 ? <></>:<div className={"tab" + (activeTab == 5 ? ' active':'')} onClick={()=>setActiveTab(5)}>
            <h6>{t("Verwijderen")}</h6>
          </div>}
          </>:<></>}
      </div>
      <div className="tabContent">
        <div className={"content" + (activeTab == 1 ? ' active':'')}>
          <div
            className={(!addNewUser ? 'hidden':'')}
          >
              <label htmlFor="type">{t("Koppel bestaande coach of maak een nieuwe aan")}</label>
              <select
                id="user_id"
                name="user_id"
                value={state.selectedCoach}
                onChange={selectExistingUser}
                className="form-control"
              >
                <option value="0">{t("Maak een nieuwe coach aan")}</option>
                {state.coaches.map(coach => {
                  return (
                    <option value={coach.id} key={coach.id}>
                      {coach.firstname} {coach.insertion} {coach.lastname}
                    </option>
                  );
                })}
              </select>
              <br/>
            {/*
              <label className={state.user.id !== 0 ? "hidden" : ""}>
                {t("Of maak een nieuwe coach aan")}
                <br /> <br />
              </label>
            */}
          </div>
          <div className={state.selectedCoach != 0 && addNewUser ? "hidden" : ""}>
            <div className="form-row align-items-center">
              <div className='image_holder' style={{ backgroundImage: "url( "+url+"/uploads/user/"+ state.user.id + "/" + profileImage + ")" }}>
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

                  <span className="btn delete">
                    <i
                      className="fas fa-trash"
                      onClick={e => deleteImage(e, profileImage)}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
            <br/>

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
                  value={state.user.firstname}
                  onChange={onChange}
                />
              </div>
              <div className="col">
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
              <div className="col">
                <label htmlFor="lastname">{t("Achternaam")}</label>
                <input
                  type="text"
                  className={"form-control" + (errorFields.includes('lastname') ? ' error':'')}
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
                  className={"form-control" + (errorFields.includes('email') ? ' error':'')}
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
                  className={"form-control" + (errorFields.includes('phone') ? ' error':'')}
                  id="phone"
                  name="phone"
                  aria-describedby="phone"
                  placeholder=""
                  value={state.user.phone}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login">{t("Gebruikersnaam")}</label>
              <input
                type="text"
                className={"form-control" + (errorFields.includes('login') ? ' error':'')}
                id="login"
                name="login"
                aria-describedby="login"
                placeholder=""
                value={state.user.login}
                onChange={onChange}
              />
            </div>

        </div>
      </div>
      <div className={"content" + (activeTab == 2 ? ' active':'')}>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="isSupervisor"
          onChange={toggleShowHasSupervisor}
          checked={state.user.isSupervisor}
        />
        <label className="form-check-label" htmlFor="isSupervisor">
          {t("Coach is tevens supervisor voor deze cursus")}
        </label>
        <br />
        <br />
      </div>
      <div className={state.user.isSupervisor ? "hidden" : ""}>
        <label htmlFor="type">{t("Coach valt onder supervisor")}</label>
        <select
          id="hasSupervisor"
          name="hasSupervisor"
          value={state.user.hasSupervisor}
          onChange={selectSupervisor}
          className="form-control"
        >
          <option value="0"> --- {t("Selecteer een supervisor")} --- </option>
          {state.supervisors.map(supervisor => {
            return (
              <option value={supervisor.id} key={supervisor.id}>
                {supervisor.firstname} {supervisor.insertion}{" "}
                {supervisor.lastname}
              </option>
            );
          })}
        </select>
      </div>
      {appSettings.max_students ?
        <div className="form-group">
          <label htmlFor="login">{t("Begeleidt max. aantal deelnemers")}</label>
          <input
            type="number"
            min="0"
            max="999"
            step="1"
            className="form-control"
            id="max_students"
            name="max_students"
            aria-describedby="max_students"
            placeholder=""
            value={state.user.max_students}
            onChange={onChange}
          />
        </div>
        :<></>}
      </div>
      <div className={"content" + (activeTab == 3 ? ' active':'')}>
      <div className="form-group">
        <label>{t("Talen")}</label>
        {languages.map((language, index) => (
          <div>
            <input
              className="form-check-input"
              type="checkbox"
              id={"language_" + language.code}
              name="languages"
              value={language.code}
              onChange={onChange}
              checked={state.user.languages.includes(language.code)}
            />
            <label className="form-check-label" htmlFor={"language_" + language.code}>
              {t(language.language)}
            </label>
          </div>
        ))}
      </div>
      {state.user.languages.includes('nl') ?
        <div className="form-group">
          <label htmlFor="login">{t("Bio Nederlands")}</label>
          <textarea
              className="form-control"
              id="bio"
              name="bio"
              value={state.user.bio}
              onChange={onChange}
              style={{
                height: '100px'
              }}
              >
          </textarea>
        </div>
       :''}
       {languages.map((language, index) => (
         <span>
         {language.code != "nl" && state.user.languages.includes(language.code) ?
           <div className="form-group">
             <label htmlFor="login">{t("Bio " + language.language)}</label>
             <textarea
                 className="form-control"
                 name="bioTranslations"
                 data-code={language.code}
                 value={getBioTranslationContent(language.code)}
                 onChange={onChange}
                 style={{
                   height: '100px'
                 }}
                 >
             </textarea>
           </div>
         :''}
         </span>
       ))}
      </div>
      <div className={"content" + (activeTab == 4 ? ' active':'')}>
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
            value={state.user.password}
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
            value={state.user.password_check}
            onChange={onChange}
          />
        </div>
      </div>
      </div>
      <div className={"content" + (activeTab == 5 ? ' active':'')}>
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
          {typeof state.user.rights.interventions != "undefined" && state.user.rights.interventions.length == 1 ? t("Verwijder coach"):t("Ontkoppel coach van deze ") + t(appSettings.interventieName.toLowerCase())}
        </label>
      </div>
      </div>
          {/*
            kan weg lijkt me of niet
            <div className="form-group">
              <label htmlFor="login">{t("Foto")}</label>
            </div>
          */}





        </div>
      </form>

      <ConfirmBox confirmOptions={confirmOptions} setConfirmOptions={setConfirmOptions} setToDeleteIndex={setToDeleteIndex}/>
    </div>
  );
});

export default Edituser;
