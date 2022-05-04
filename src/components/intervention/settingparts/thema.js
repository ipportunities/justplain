import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import MediaLibrary from "../../medialibrary";
import { setChosenImage, setSavingStatus } from "../../../actions";
import AddImage from "../../content/edit/parts/helpers/addImage";
import { getClone } from "../../utils";
import { setIntervention } from "../../../actions";
import InputField from "./theme/inputField.js";
import t from "../../translate";
import {appSettings} from "../../../custom/settings";

let saveSettingsTimeout = null;

const InterventionTheme = props => {

  const dispatch = useDispatch();
  const intervention = useSelector(state => state.intervention);
  const url = useSelector(state => state.url);
  const [themeId, setThemeId] = useState('')

  useEffect(() => {

    ////DIT zijn settings die we moeten zetten als je een nieuwe interventie aanmaakt. Voor nu om het werkend te houden
    if (intervention.settings.themeId != "" && typeof intervention.settings.themeId != "undefined") {
      setThemeId(intervention.settings.themeId)
    } else {
      setThemeId(appSettings.baseThemeID)
    }
    let interventionC = getClone(intervention);

    if(typeof intervention.settings.stressText == "undefined"){
      intervention.settings.stressText = t("Hoe gestrest ben je?");
      saveTheme(interventionC);
    }
    if(typeof intervention.settings.menu == "undefined"){
      interventionC.settings.menu = {};
      interventionC.settings.menu.homework = "Huiswerk";
      interventionC.settings.menu.modules = "Lessen";
      interventionC.settings.menu.objectives = "Activiteiten";
      interventionC.settings.menu.journal = "Dagboek";
      interventionC.settings.menu.stress = "Stress";
      interventionC.settings.menu.coach = "Coach";
      interventionC.settings.menu.livechat = "Chat";
      saveTheme(interventionC);
    }
  }, []);

  ////////////////////////////////////////////
  /////////Media library functies om door te geven
  ///////////////////////////////////////////
  const [mediaLibraryVisible, setMediaLibraryVisible] = useState("hide");
  const medialibrary = useSelector(state => state.mediaLibrary);
  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "")
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    let interventionC = getClone(intervention);
    if(medialibrary.index == "coverPhoto"){
      interventionC.settings.coverPhoto = url + "/uploads/intervention/" + medialibrary.chosen_image;
    }
    if(medialibrary.index == "logo"){
      interventionC.settings.logo = url + "/uploads/intervention/" + medialibrary.chosen_image;
    }

    saveTheme(interventionC);
  }

  function showMediaLibrary(index) {
    setMediaLibraryVisible("show");
    document.getElementsByTagName('html')[0].style.overflow = "hidden";
    /// empty store + set index
    dispatch(setChosenImage("", index));
  }

  function deleteImage(){
    let interventionC = getClone(intervention);
    interventionC.settings.coverPhoto = "";
    saveTheme(interventionC);
  }
  function deleteLogo(){
    let interventionC = getClone(intervention);
    interventionC.settings.logo = "";
    saveTheme(interventionC);
  }


  //////////////////////
  ///Save theme
  function saveTheme(interventionC) {
    //set settings in global state:
    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        interventionC.settings
      )
    );

    props.setErrorMessage("");
    clearTimeout(saveSettingsTimeout);
    dispatch(setSavingStatus("not_saved"));

    saveSettingsTimeout = setTimeout(() => {
      props.saveSettings(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        interventionC.settings
      );
    }, 1500);
  };


  function setTheme(theme_id){
    let interventionC = getClone(intervention);
    interventionC.settings.themeId = theme_id;
    saveTheme(interventionC);
    setThemeId(theme_id)
  }

  return(
    <div>
      <MediaLibrary
        mediaLibraryVisible={mediaLibraryVisible}
        setMediaLibraryVisible={setMediaLibraryVisible}
      />
      <div className="question logo">
        <h5>{t("Logo")}</h5>
        {t("Brand je " + appSettings.interventieName.toLowerCase() + " met je eigen logo")}
        <AddImage index="logo" showMediaLibrary={showMediaLibrary} image={typeof intervention.settings.logo != "undefined"?intervention.settings.logo:''} deleteImage={deleteLogo}/>
      </div>
      <div className="question">
        <h5>{t("Cover foto")}</h5>
        {t("Geef je " + appSettings.interventieName.toLowerCase() + " een eigen indentiteit met een cover foto")}
        <AddImage index="coverPhoto" showMediaLibrary={showMediaLibrary} image={typeof intervention.settings.coverPhoto != "undefined"?intervention.settings.coverPhoto:''} deleteImage={deleteImage}/>
      </div>
      {appSettings.allowedThemes.length > 1 ?
        <div className="question">
          <h5>{t("Thema")}</h5>
          {t("Kies een thema")}
          <div className="imageOptions">
            {appSettings.allowedThemes.map((themeID, index) => (
              <div key={themeID}>
                <input type="radio" name="theme" id={"theme_" + themeID} onChange={()=>setTheme(themeID)} checked={themeId == themeID ? 'checked':''}/>
                <label htmlFor={"theme_" + themeID}>
                  <img src={require('../../../images/admin/theme_'+themeID+'.jpg')} className='phone'/>
                </label>
              </div>
            ))}
          </div>
        </div>
        :''}
      <div className="question">
        <h5>{t("Menu opties")}</h5>
        {intervention.settings.intervention_type != "chatcourse" ?
          <InputField
            label={t("Lessen")}
            html={typeof intervention.settings.menu != "undefined" && typeof intervention.settings.menu.modules != "undefined"? intervention.settings.menu.modules:''}
            updateField={'modules'}
            saveTheme={saveTheme}
            intervention={getClone(intervention)}/>
        :
          <InputField
            label={t("Huiswerk")}
            html={typeof intervention.settings.menu != "undefined" && typeof intervention.settings.menu.homework != "undefined"? intervention.settings.menu.homework:''}
            updateField={'homework'}
            saveTheme={saveTheme}
            intervention={getClone(intervention)}/>
        }
        <InputField
          label={t("Dagboek")}
          html={typeof intervention.settings.menu != "undefined"&& typeof intervention.settings.menu.journal != "undefined" ? intervention.settings.menu.journal:''}
          updateField={'journal'}
          saveTheme={saveTheme}
          intervention={getClone(intervention)}/>
        <InputField
          label={t("Doelen")}
          html={typeof intervention.settings.menu != "undefined"&& typeof intervention.settings.menu.objectives != "undefined" ? intervention.settings.menu.objectives:''}
          updateField={'objectives'}
          saveTheme={saveTheme}
          intervention={getClone(intervention)}/>
        <InputField
          label={t("Stress")}
          html={typeof intervention.settings.menu != "undefined"&& typeof intervention.settings.menu.stress != "undefined" ? intervention.settings.menu.stress:''}
          updateField={'stress'}
          saveTheme={saveTheme}
          intervention={getClone(intervention)}/>
        <InputField
          label={t("Coach")}
          html={typeof intervention.settings.menu != "undefined"&& typeof intervention.settings.menu.coach != "undefined" ? intervention.settings.menu.coach :''}
          updateField={'coach'}
          saveTheme={saveTheme}
          intervention={getClone(intervention)}/>
        {appSettings.liveChatAvailable ?
          <InputField
            label={t("Chat")}
            html={typeof intervention.settings.menu != "undefined"&& typeof intervention.settings.menu.livechat != "undefined" ? intervention.settings.menu.livechat :''}
            updateField={'livechat'}
            saveTheme={saveTheme}
            intervention={getClone(intervention)}/>
          :false}
      </div>
      {/*
        <div className="question">
          <h5>{t("Stressmeter")}</h5>
          <InputField
            label={t("Doelen")}
            html={typeof intervention.settings.stressText != "undefined" ?intervention.settings.stressText:''}
            updateField={'stressText'}
            saveTheme={saveTheme}
            intervention={getClone(intervention)}/>
        </div>
      */}

    </div>
  )
};

export default InterventionTheme;
