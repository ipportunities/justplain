import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import AddImage from "../../content/edit/parts/helpers/addImage";
import MediaLibrary from "../../medialibrary";
import { setChosenImage } from "../../../actions";
import { getClone } from "../../utils";

let saveSettingsTimeout = null;

const InterventionSettingsCoach = props => {
  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const url = useSelector(state => state.url);

  const saveCoachSettings = (newSettings) => {

    dispatch(
      setIntervention(
        intervention.id,
        intervention.organisation_id,
        intervention.title,
        newSettings
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
        newSettings
      );
    }, 1500);
  }

  ////////////////////////////////////////////
  /////////Media library functies om door te geven
  ///////////////////////////////////////////
  const [mediaLibraryVisible, setMediaLibraryVisible] = useState("hide");
  const medialibrary = useSelector(state => state.mediaLibrary);
  //////////////////////
  ///Save if chosen image uit bieb is not empty alleen bij overeenkomstige id
  if(medialibrary.chosen_image != "" && medialibrary.index == "coachPhoto")
  {
    /// empty chosen image status
    dispatch(
      setChosenImage(
        ''
      )
    );
    let interventionC = getClone(intervention);
    if(medialibrary.index == "coachPhoto"){
      interventionC.settings.coachPhoto = url + "/uploads/intervention/" + medialibrary.chosen_image;
    }
    saveCoachSettings(interventionC.settings);
  }

  function showMediaLibrary(index) {
    setMediaLibraryVisible("show");
    document.getElementsByTagName('html')[0].style.overflow = "hidden";

    /// empty store + set index
    dispatch(setChosenImage("", index));
  }

  function deleteImage(){
    let interventionC = getClone(intervention);
    interventionC.settings.coachPhoto = "";
    saveCoachSettings(interventionC.settings);
  }

  return (
    <div id="settings-coach" className="form-group">
      <MediaLibrary
        mediaLibraryVisible={mediaLibraryVisible}
        setMediaLibraryVisible={setMediaLibraryVisible}
      />
      <div className="question logo">
        <h5>{t("Coach achtergrond afbeelding")}</h5>
        <AddImage index="coachPhoto" showMediaLibrary={showMediaLibrary} image={typeof intervention.settings.coachPhoto != "undefined"?intervention.settings.coachPhoto:''} deleteImage={deleteImage}/>
      </div>
    </div>
  );
};

export default InterventionSettingsCoach;
