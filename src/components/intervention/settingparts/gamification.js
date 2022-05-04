import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention, setSavingStatus } from "../../../actions";
import t from "../../translate";
import ContentEditable from 'react-contenteditable'
import Badges from './gamification/badges'
import { getClone } from "../../utils";

let saveSettingsTimeout = null;

const InterventionSettingsGamification = props => {

  const [gamificationSettings, setGamificationSettings] = useState(false);
  const [pointsData, setPointsData] = useState({});
  const [badgetsData, setBadgetsData] = useState({});
  const dispatch = useDispatch();
  const intervention = useSelector(state => state.intervention);
  const [badges, setBadges] = useState([1,2,3,4,5,6,7,8,9,10])
  const [setBadgesOption, setSetBadgesOption] = useState(false)

  useEffect(() => {
    if(typeof intervention.settings.gamification != "undefined"){
      setGamificationSettings(intervention.settings.gamification)
      if(typeof intervention.settings.gamification.pointsData != "undefined"){
        setPointsData(intervention.settings.gamification.pointsData)
      }
      if(typeof intervention.settings.gamification.badgetsData != "undefined"){
        setBadgetsData(intervention.settings.gamification.badgetsData)
      }
    } else {
      intervention.settings.gamification = [];
      intervention.settings.gamification.pointsData = {};
      intervention.settings.gamification.badgesData = {};
    }
  }, [intervention]);

  function togglePart(part){
    let tempGamificationSettings = getClone(gamificationSettings);
    tempGamificationSettings[part] = tempGamificationSettings[part] ? false:true;
    setGamificationSettings(tempGamificationSettings);

    let interventionC = getClone(intervention);
    interventionC.settings.gamification = tempGamificationSettings;
    saveGamificationSettings(interventionC.settings);
  }

  function updatePoints(type, value){
    let tempPoints = getClone(pointsData);
    tempPoints[type] = value;
    setPointsData(tempPoints)

    let interventionC = getClone(intervention);
    interventionC.settings.gamification.pointsData = tempPoints;
    saveGamificationSettings(interventionC.settings);
  }

  function updateBadges(type, value){
    let tempBadges = getClone(badgetsData);
    tempBadges[type] = value;
    setBadgetsData(tempBadges)

    let interventionC = getClone(intervention);
    interventionC.settings.gamification.badgetsData = tempBadges;
    saveGamificationSettings(interventionC.settings);
  }
  function updateBadgesOption(image){
    let tempBadges = getClone(badgetsData);
    let temp_setBadgesOption = setBadgesOption.split("_");

    if(typeof tempBadges[temp_setBadgesOption[0] + "_badges"] == "undefined"){
      tempBadges[temp_setBadgesOption[0] + "_badges"] = [];
    }

    let this_badge_obj = tempBadges[temp_setBadgesOption[0] + "_badges"].filter(function (badge) {
      return badge.option === temp_setBadgesOption[1]
    });

    if(this_badge_obj.length != 0){
      tempBadges[temp_setBadgesOption[0] + "_badges"][tempBadges[temp_setBadgesOption[0] + "_badges"].indexOf(this_badge_obj[0])].image = image;
    } else {
      tempBadges[temp_setBadgesOption[0] + "_badges"].push({image:image, option:temp_setBadgesOption[1]})
    }

    setBadgetsData(tempBadges)
    setSetBadgesOption(false)

    let interventionC = getClone(intervention);
    interventionC.settings.gamification.badgetsData = tempBadges;
    saveGamificationSettings(interventionC.settings);
  }

  const saveGamificationSettings = (newSettings) => {

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


  return (
    <div id="settings-gamifcation" className="form-group">
      <div className="part">
        <table>
          <tbody>
            <tr>
              <td>
                <h5>
                  {t("Punten")}
                </h5>
              </td>
              <td>
                <label className="switch">
                  <input type="checkbox" checked={gamificationSettings != false && gamificationSettings.points ? true:false} onClick={(e) => togglePart("points")}/>
                  <span className="slider_switch round" ></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        {gamificationSettings != false && gamificationSettings.points ?
          <div className="settings points">
            <table>
              <tbody>
                <tr>
                  <td>
                    <div>
                      {t("Inloggen")} <input type="number" value={pointsData.login} placeholder={t("punten")} onChange={(e)=>updatePoints("login", e.target.value)}/>
                    </div>
                    <div>
                      {t("Starten interventie")} <input type="number" value={pointsData.start_intervention} placeholder={t("punten")} onChange={(e)=>updatePoints("start_intervention", e.target.value)}/>
                    </div>
                    <div>
                      {t("Doen van doel")} <input type="number" value={pointsData.start_goal} placeholder={t("punten")} onChange={(e)=>updatePoints("start_goal", e.target.value)}/>
                    </div>
                    <div>
                      {t("Starten vragenlijst")} <input type="number" value={pointsData.start_questionnaire} placeholder={t("punten")} onChange={(e)=>updatePoints("start_questionnaire", e.target.value)}/>
                    </div>
                  </td>
                  <td>
                    <div>
                      {t("Afronden les")} <input type="number" value={pointsData.finish_lesson} placeholder={t("punten")} onChange={(e)=>updatePoints("finish_lesson", e.target.value)}/>
                    </div>
                    <div>
                      {t("Afronden optionele les")} <input type="number" value={pointsData.finish_optional_lesson} placeholder={t("punten")} onChange={(e)=>updatePoints("finish_optional_lesson", e.target.value)}/>
                    </div>
                    <div>
                      {t("Afronden vragenlijst")} <input type="number" value={pointsData.finish_questionnaire} placeholder={t("punten")} onChange={(e)=>updatePoints("finish_questionnaire", e.target.value)}/>
                    </div>
                    <div>
                      {t("Afronden interventie")} <input type="number" value={pointsData.finish_intervention} placeholder={t("punten")} onChange={(e)=>updatePoints("finish_intervention", e.target.value)}/>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          :<></>}
      </div>
      <div className="part">
        <table>
          <tbody>
            <tr>
              <td>
                <h5>
                  {t("Badges")}
                </h5>
              </td>
              <td>
                <label className="switch">
                  <input type="checkbox" checked={gamificationSettings != false && gamificationSettings.badges ? true:false} onClick={(e) => togglePart("badges")}/>
                  <span className="slider_switch round" ></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        {gamificationSettings != false && gamificationSettings.badges ?
          <div className="settings badges">
            <div className="example">
              {t("Bijvoorbeeld: 1,2,4,all")}
            </div>
            <Badges
              type={t("Lessen")}
              placeholder={t("1,2,4,all")}
              updateBadges={updateBadges}
              type="lesson"
              value={badgetsData.lesson}
              badgetsData={badgetsData}
              setSetBadgesOption={setSetBadgesOption}
              />
            <Badges
              type={t("Doelen")}
              placeholder={t("1,2,4,all")}
              updateBadges={updateBadges}
              type="goals"
              value={badgetsData.goals}
              badgetsData={badgetsData}
              setSetBadgesOption={setSetBadgesOption}
              />
            <Badges
              type={t("Vragenlijsten")}
              placeholder={t("1,2,4,all")}
              updateBadges={updateBadges}
              type="questionnaire"
              value={badgetsData.questionnaire}
              badgetsData={badgetsData}
              setSetBadgesOption={setSetBadgesOption}
              />

              <div className={(setBadgesOption == false ? '':'show') + " options"}>
                <h3>{t("Selecteer een badge")}</h3>
                {badges.map((image_index, index) => (
                  <img src={require('../../../custom/images/badges/'+image_index+'.png')} onClick={()=>updateBadgesOption(image_index)} className={setBadgesOption != false && setBadgesOption.split("_")[1] == image_index ? 'active':''}/>
                ))}
              </div>
          </div>
          :<></>}
      </div>
    </div>
  );
}

export default InterventionSettingsGamification
