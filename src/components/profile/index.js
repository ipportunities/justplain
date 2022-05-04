import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../translate";
import { validateEmail, getClone } from "../utils";
import apiCall from "../api";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { Dutch } from "flatpickr/dist/l10n/nl.js";
import { login, setActiveLanguage, setIntervention, setUiTranslation, setActiveIntervention } from "../../actions";
import standardAvatar from "../../images/course/standard/avatar.png";
import Logout from "../logout";
import {appSettings} from "../../custom/settings";

let saveTimeout = false;

const Profile = (props) =>{

  const dispatch = useDispatch();
  const history = useHistory();

  const [emailValid, setEmailValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);

  const [editName, setEditName] = useState(false)
  const [activePart, setActivePart] = useState('')
  const [localAuth, setLocalAuth] = useState({
    user_id: 0,
    token: '',
    userType: 'student',
    rights: {},
    firstname: '',
    insertion: '',
    lastname: '',
    date_time_birth: 0,
    name: '',
    email: '',
    gender: '',
    education: '',
  })
  const [localPreferences, setLocalPreferences] = useState([])
  const [profileImage, setProfileImage] = useState(standardAvatar)

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([0]);

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const activeLanguage = useSelector(state => state.activeLanguage);
  const url = useSelector(state => state.url);

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (auth != "" && !loaded) {
      setLoaded(true);
      setLocalAuth(auth);
      setLocalPreferences(auth.preferences);
      if(auth.profile_pic != ""){
        setProfileImage(url+"/uploads/user/"+ auth.user_id + "/" + auth.profile_pic + "?"+new Date().getTime())
      }
    }
  }, []);

  useEffect(() => {

    if (intervention.id > 0)
    {

      let language_id = intervention.settings.language_id;
      if (!Number.isInteger(language_id))
      {
        language_id = 1; //dutch
      }
      let newOptions = [];
      intervention.settings.languages.forEach(language => {
        let translationFound = intervention.settings.translations.find(transl => {
          return language.code === transl.code
        })
        if (parseInt(language_id) === parseInt(language.id) || translationFound !== 'undefined')
        {
          newOptions.push(language);
        }
      })
      setOptions(newOptions);

    }

  }, [intervention])

  useEffect(() => {

    if (activeLanguage !== 0)
    {
      setSelectedOption(parseInt(activeLanguage));
    }

  }, [activeLanguage])

  const changeLanguage = (e) => {

    //nieuwe vertaling laden
    let language_id = e.target.value;
    loadLanguage(language_id);

  }

  const loadLanguage = (language_id) => {
    //interventie settings ophalen en in redux store plaatsen
    apiCall({
      action: "get_intervention_settings",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        include_forms: true, //tijdelijk...
        language_id: language_id
      }
    }).then(resp => {
      dispatch(
        setIntervention(
          intervention.id,
          resp.organisation_id,
          resp.title,
          resp.settings
        )
      );
      dispatch(setActiveLanguage(parseInt(language_id)));
      //UI wijzigen?
      if (parseInt(language_id) === 1)
      {
        dispatch(setUiTranslation(1, []));
      }
      else
      {
        dispatch(setUiTranslation(language_id, resp.settings.ui_translation));
      }
      //leg voorkeur vast in preferences:
      let languagePref = auth.preferences.find(pref => {
        return pref.option === 'language_id'
      })
      if (typeof languagePref === 'undefined' || parseInt(languagePref.value) !== parseInt(language_id))
      {
        let newAuth = getClone(auth);
        let foundLanguagePreference = false;
        newAuth.preferences.forEach((pref, index) => {
          if (pref.option === 'language_id')
          {
            foundLanguagePreference = true;
            newAuth.preferences[index].value = language_id;
          }
        })
        if (!foundLanguagePreference)
        {
          newAuth.preferences.push({
            option: 'language_id',
            value: language_id
          })
        }
        saveProfile(newAuth);

       }
    });
  }

  function updateSetting(newAuthToSet) {

    let newAuth = {...localAuth};
    for (var key in newAuthToSet) {
      if (key == 'email' && !validateEmail(newAuthToSet[key])) {
        setEmailValid(false);
      } else if(key == 'email') {
        setEmailValid(true);
      }
      newAuth[key] = newAuthToSet[key];
    }

    setLocalAuth(newAuth);
    if(validateEmail(newAuth["email"])){
      saveProfile(newAuth)
    }

    /// dispatch om naams wijziging door te voeren
  }

  function keyDown(e){
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  //////////////////////
  ///Upload image to server
  function uploadImage(uploadedFiles) {
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
        action: "upload_user_image",
        token: auth.token,
        data: {
          files: files
        }
      };

      apiCall(apiObj).then(resp => {
        if (resp) {
          if(resp.error == 0){
            setProfileImage(url+"/uploads/user/"+ auth.user_id + "/"+ files[0].name + "?"+new Date().getTime());
            updateSetting({profile_pic:files[0].name})
          }
        }
      });
    });
  }

  //////////////////////
  ///Delete image from server
  function deleteImage(e, name) {
    e.stopPropagation();

    let apiMsg = {
      action: "delete_user_image",
      token: auth.token,
      data:{
        name:name
      }
    };

    apiCall(apiMsg).then(resp => {
      if (false !== resp) {
        if (resp.error == 0) {
          setProfileImage(standardAvatar);
          updateSetting({profile_pic:''})
        }
      }
    });
  }

  ////////////////////////////////////////////
  /////////Image action
  ///////////////////////////////////////////
  let inputFileRef = React.createRef();
  function triggerInputFile() {
    inputFileRef.current.click();
  }

  function getAge(){
    var ageDifMs = Date.now() - localAuth.date_time_birth;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function saveProfile(newAuth){
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      newAuth.name = newAuth.firstname + ' ' + newAuth.insertion + ' ' + newAuth.lastname
      apiCall({
        action: "save_user_profile",
        token: auth.token,
        data: newAuth
      }).then(resp => {
        if (resp.error == 0) {
          dispatch(
            login(
              localAuth.user_id,
              newAuth.name,
              localAuth.token,
              localAuth.userType,
              localAuth.rights,
              newAuth.preferences,
              newAuth.profile_pic, /// deze wordt niet opgeslagen wel het plaatje
              newAuth.email,
              newAuth.gender,
              newAuth.education,
              newAuth.date_time_birth,
              newAuth.firstname,
              newAuth.insertion,
              newAuth.lastname,
            )
          );
        }
      });
    })
  }

  function changePreference(preference){
    let newPreferences = [...localPreferences]
    let this_pref_obj = newPreferences.filter(function (pref) {
      return pref.option === preference
    });

    if(this_pref_obj.length != 0)
    {
      let this_pref_obj_index = newPreferences.indexOf(this_pref_obj[0]);
      let newValue = newPreferences[this_pref_obj_index].value == 'false' ? 'true':'false';
      newPreferences[this_pref_obj_index].value = newValue
    } else {
      newPreferences.push({option:preference, value:'true'})
    }
    setLocalPreferences(newPreferences)
    updateSetting({preferences: newPreferences})
  }

  function checkIfTrue(preference){
    let this_pref_obj = localPreferences.filter(function (pref) {
      return pref.option === preference
    });

    if(this_pref_obj.length != 0)
    {
      let this_pref_obj_index = localPreferences.indexOf(this_pref_obj[0]);

      return localPreferences[this_pref_obj_index].value == 'false' ? false:true
    } else {
      return false;
    }
  }

  function toggleEditName(){
    let newValue = editName == '' ? 'edit':''
    setEditName(newValue)
  }

  function goToCourses(){
    history.push("/courses/");
  }

  return(
    <div className="profile">
      <h1>{t('Jouw profiel')}</h1>
      <div className="personalia">
        <table className='image_name'>
          <tbody>
            <tr>
              <td>
                <div className='image_holder' style={{ backgroundImage: "url(" + profileImage + ")" }}>
                  <input
                    type="file"
                    onChange={e => uploadImage(e.target.files)}
                    name="file"
                    ref={inputFileRef}
                    multiple={true}
                  />
                  <div className="options">
                    <span className="btn handle" onClick={triggerInputFile}>
                      <i className="fas fa-camera-retro"></i>
                    </span>
                    {profileImage != standardAvatar ?
                      <span className="btn delete"   onClick={e => deleteImage(e, profileImage)}>
                        <i className="fas fa-trash"></i>
                      </span>
                      :''}

                  </div>
                </div>
              </td>
              <td>
                <div className="name">
                  {localAuth.name}
                  <span className="btn handle" onClick={() => toggleEditName()}>
                    <i className="fas fa-pen"></i>
                  </span>
                </div>
                <Logout button='true'/>



              </td>
            </tr>
          </tbody>
        </table>

        <div className={editName != '' ? '':'hide'}>
          <div className='field'>
            {t('Voornaam')} : <input type="text" onChange={(e) => updateSetting({firstname: e.target.value})} value={localAuth.firstname} placeholder={t("Voornaam")}/>
          </div>
          <div className='field'>
            {t('Tussenvoegsel')} : <input type="text" onChange={(e) => updateSetting({insertion: e.target.value})} value={localAuth.insertion} placeholder={t("Tussenvoegsel")}/>
          </div>
          <div className='field'>
            {t('Achternaam')} : <input type="text" onChange={(e) => updateSetting({lastname: e.target.value})} value={localAuth.lastname} placeholder={t("Achternaam")}/>
            <br/>
            <br/>
          </div>
        </div>
        {
          /*
        <div className='field'>
          {t('Leeftijd')} : &nbsp;
          {getAge()}
        </div>
        <div className='field'>
          {t('Geboortedatum')} :
          <Flatpickr
            options={{ locale: Dutch, dateFormat: "d.m.Y" }}
            value={localAuth.date_time_birth * 1000}
            onChange={date => {
              updateSetting({date_time_birth: date[0].getTime()/1000 })
            }}
          />
        </div>
        */
          }
          <div className='field'>
            {t('E-mail')} : <input type="text" onChange={(e) => updateSetting({email: e.target.value})} value={localAuth.email} placeholder={t("E-mail")} style={{backgroundColor: emailValid ? '' : 'red'}} />  <em style={{fontSize: '0.7em'}}> { emailValid ? '' : 'Vul een geldig email adres in' }</em>
          </div>
          {appSettings.profilePhone ?
            <div className='field'>
              {t('Telefoonnummer')} : <input type="text" onChange={(e) => updateSetting({phone: e.target.value})} value={localAuth.phone} placeholder={t("Telefoonnummer")} style={{backgroundColor: phoneValid ? '' : 'red'}} />  <em style={{fontSize: '0.7em'}}> { phoneValid ? '' : 'Vul een geldig telefoonnummer in' }</em>
            </div>
            :<></>}
        {appSettings.profileSexe ?
          <div className='field'>
            {t('Geslacht')} :
              <select onChange={(e) => updateSetting({gender: e.target.value})} value={localAuth.gender}>
                <option value="M">{t('Man')}</option>
                <option value="F">{t('Vrouw')}</option>
              </select>
          </div>
          :<></>}
        {appSettings.profileEducation ?
          <div className='field'>
            {t('Opleiding')} : <input type="text" onChange={(e) => updateSetting({education: e.target.value})} value={localAuth.education} placeholder={t("Opleiding")}/>
          </div>
          :<></>}
      </div>
      <div className="preferences">
            {
              options.length > 0 && appSettings.translations ?
                <div className="option clearfix">
                  {t('Taal')} :
                  <select onChange={(e) => changeLanguage(e)} value={selectedOption}>
                    {
                      options.map((option, index) => {

                        return(
                        <option key={index} value={option.id}>{option.language} ({option.code})</option>
                        )
                      })
                    }
                  </select>
                </div>
              : false
            }

        {/*
        <div className="option clearfix">
          {t('Herinneringsberichten voor deze module?')}
          <label className="switch">
            <input type="checkbox" checked={checkIfTrue("reminder_for_module")}  onChange={()=>changePreference("reminder_for_module")}/>
            <span className="slider_switch round"></span>
          </label>
        </div>
        <div className="option clearfix">
          {t('Recap emails after each module?')}
          <label className="switch">
            <input type="checkbox" checked={checkIfTrue("recap_emails")}  onChange={()=>changePreference("recap_emails")}/>
            <span className="slider_switch round"></span>
          </label>
        </div>
        <div className="option clearfix">
          {t('Notifications for your goals?')}
          <label className="switch">
            <input type="checkbox" checked={checkIfTrue("notification_goals")}  onChange={()=>changePreference("notification_goals")}/>
            <span className="slider_switch round"></span>
          </label>
        </div>
        */}
      </div>
      {auth.rights.interventions.length > 1 ?
        <div className="notificationAbout">
          <div>
            {t('Selecteer hier een andere ' + appSettings.interventieName.toLowerCase() + '.')}
          </div>
          <span className='btn btn-primary' onClick={()=>goToCourses()}>
            {t('Wijzig ' + appSettings.interventieName.toLowerCase())}
          </span>
        </div>
      :''}

    </div>
  )
}

export default Profile
