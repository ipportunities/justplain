import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setActiveIntervention } from "../../../actions/";
import LinkBox from "../../profile/linkBox.js";
import ProfileCoachName from "./leftbottom/profile_coach_name.js";
import {appSettings} from "../../../custom/settings";
import t from "../../translate";

const LeftBottom = (props) => {

  const history = useHistory();
  const activePart = useSelector(state => state.activePart);
  const intervention = useSelector(state => state.intervention);
  const [logoToUse, setLogoToUse] = useState('');
  const auth = useSelector(state => state.auth);

  const resetActiveIntervention = () => {
    /// wat is dit?
    //dispatch(setActiveIntervention(0));
  }
   const goTo = () => {
    if(appSettings.home_url_extern){
      window.location = appSettings.domain_url;
    } else {
      if(auth.rights.interventions.length > 1){
        history.push("/courses/");
      }
    }
  }

  useEffect(() => {
    if(intervention.id > 0){
      if(!appSettings.profileCoachName) {
        if(typeof intervention.settings.logo != 'undefined' && intervention.settings.logo != '')
        {
          setLogoToUse(intervention.settings.logo)
        } else {
          setLogoToUse(appSettings.logo)
        }
      }

    }
  }, [intervention]);

  return(
    <div className={"leftBottom" + (appSettings.profileCoachName ? ' profile_coach_name':'')}>
      {!(activePart == 'lesson' || activePart == 'optional-lesson') ?
        <>
          {appSettings.profileCoachName ?
            <>
              <ProfileCoachName extraClass='' />
            </>
            :
            <>
              <span onClick={()=>goTo()} className={appSettings.home_url_extern ? 'pointer':''}>
                <img src={logoToUse} className="logo"/>
              </span>
              { auth.name.length > 0 && appSettings.profile != false ?
                <LinkBox highlightName={activePart == 'settings'?'btn btn-primary':''}/>
                :
                false
              }
            </>
          }

        </>
      :''}
    </div>
  )
}

export default LeftBottom;
