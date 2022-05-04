import React, {useState, useEffect} from "react";
import { useSelector } from "react-redux";
import {getProfileImage} from "../../../helpers/images";
import standardAvatar from "../../../../images/course/standard/avatar.png";
import apiCall from "../../../api";
import {appSettings} from "../../../../custom/settings";
import t from "../../../translate";

const ProfileCoachName = (props) => {

  const [myCoach, setMyCoach] = useState('');
  const intervention = useSelector(state => state.intervention);
  const url = useSelector(state => state.url);
  const [profileImage, setProfileImage] = useState(standardAvatar)
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (auth != "") {
      setProfileImage(getProfileImage(auth, url))
    }
  }, [auth]);

  useEffect(() => {
    if(intervention.id > 0){
      if(appSettings.profileCoachName){
        apiCall({
          action: "get_coach",
          token: auth.token,
          data: {
            intervention_id:intervention.id,
          }
        }).then(resp => {
          if (resp.msg == 'ok' && resp.coach)
          {
            setMyCoach(resp.coach)
          }
        });
      }
    }
  }, [intervention]);

  return (
    <div className={"content " + props.extraClass}>
      {profileImage != "" ?
        <div className='image_holder' style={{ backgroundImage: "url(" + profileImage + ")" }}></div>
      :''}
      <div className="text">
        {myCoach != "" ?
          <>
            {t(appSettings.begeleiderName)} {myCoach.firstname} {myCoach.insertion !=  "" ? myCoach.insertion + " ":''}{myCoach.lastname}<br/>
          </>
        :''}
        {auth.name}<br/>
        {/*
          Functie (is er nog niet)
        */}
      </div>
    </div>
  )
}

export default ProfileCoachName;
