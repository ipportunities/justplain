import React, {useState, useEffect, Fragment} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getClone } from "../../utils";
import {appSettings} from "../../../custom/settings";
import { setActivePart, setActiveIntervention, setShowLeftMenu, setIntervention } from "../../../actions/";
import t from "../../translate";
import { isToday } from "../../helpers/changeFormatDate.js";

const MenuItems = () => {

  const auth = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();

  const activePart = useSelector(state => state.activePart);
  const intervention = useSelector(state => state.intervention);
  const showLeftMenu = useSelector(state => state.showLeftMenu);
  const [liveChatAvailable, setLiveChatAvailable] = useState(false);

  const changeActivePart = (activePart) => {
    dispatch(setActivePart(activePart));
    dispatch(setShowLeftMenu(false));
    history.push("/course/"+intervention.id+"/"+activePart);

    /// als we chat openen zet 0 nieuwe berichten
    if(activePart == "chat" && intervention.settings.numberOfNewMessages > 0){
      let newIntervention = getClone(intervention);
      newIntervention.settings.numberOfNewMessages = 0;
      dispatch(
        setIntervention(
          intervention.id,
          intervention.organisation_id,
          intervention.title,
          newIntervention.settings
        )
      );
    }
  }

  /// dit nog uitzoeken <= heeft betrekking op het mobiele menu
  const [showMenu, setShowMenu] = useState(false)

  function toggleMenu(){
    dispatch(setShowLeftMenu(showLeftMenu?false:true))
  }

  const [modulesTitle, setModulesTitle] = useState('Lessen')
  const [objectivesTitle, setObjectivesTitle] = useState('Activiteiten')
  const [journalTitle, setJournalTitle] = useState('Dagboek')
  const [stressTitle, setStressTitle] = useState('Stemming')
  const [coachTitle, setCoachTitle] = useState('Coach')
  const [homeworkTitle, setHomeworkTitle] = useState('Huiswerk')
  const [agendaTitle, setAgendaTitle] = useState('Agenda')
  const [chatarchiveTitle, setChatarchiveTitle] = useState('Chat archief')
  const [liveChatTitle, setLiveChatTitle] = useState('Chat')

    useEffect(() => {

    if(typeof intervention.settings.menu != "undefined")
    {
      if(typeof intervention.settings.menu.modules != "undefined" && intervention.settings.menu.modules != ""){
        setModulesTitle(intervention.settings.menu.modules)
      }
      if(typeof intervention.settings.menu.objectives != "undefined" && intervention.settings.menu.objectives != ""){
        setObjectivesTitle(intervention.settings.menu.objectives)
      }
      if(typeof intervention.settings.menu.journal != "undefined" && intervention.settings.menu.journal != ""){
        setJournalTitle(intervention.settings.menu.journal)
      }
      if(typeof intervention.settings.menu.stress != "undefined" && intervention.settings.menu.stress != ""){
        setStressTitle(intervention.settings.menu.stress)
      }
      if(typeof intervention.settings.menu.coach != "undefined" && intervention.settings.menu.coach != ""){
        setCoachTitle(intervention.settings.menu.coach)
      }
      if(typeof intervention.settings.menu.livechat != "undefined" && intervention.settings.menu.livechat != ""){
        setLiveChatTitle(intervention.settings.menu.livechat)
      }
      if(typeof intervention.settings.menu.homework != "undefined" && intervention.settings.menu.homework != ""){
        setHomeworkTitle(intervention.settings.menu.homework)
      }
      if(typeof intervention.settings.menu.agenda != "undefined" && intervention.settings.menu.agenda != ""){
        setAgendaTitle(intervention.settings.menu.agenda)
      }
      if(typeof intervention.settings.menu.chatarchive != "undefined" && intervention.settings.menu.chatarchive != ""){
        setChatarchiveTitle(intervention.settings.menu.chatarchive)
      }

    }

    ///check of live chat is beschikbaar vandaag
    if(intervention.id > 0){
      if(typeof intervention.settings !== "undefined" && typeof intervention.settings.selfhelp.guided_selfhelp_live_chat !== "undefined" && typeof intervention.settings.contactMoments !== "undefined" && intervention.settings.selfhelp.guided_selfhelp_live_chat === 1){
        ///gepland of gewoon open
        if(intervention.settings.selfhelp.guided_selfhelp_plan_contact === 1) {
          for(let i = 0 ; i < intervention.settings.contactMoments.length; i++){
            if(intervention.settings.contactMoments[i].date_time != "" && isToday(intervention.settings.contactMoments[i].date_time) && intervention.settings.contactMoments[i].type == "chat"){
              setLiveChatAvailable(true)
              break;
            }
          }
        } else {
          setLiveChatAvailable(true)
        }
      }
    }

  }, [intervention]);

  return(
    <div className="items clearfix">
    <table className="holder ">
      <tbody>
      {intervention.settings.intervention_type == "chatcourse" ?
        <>
          <tr
            className={"my-homework " + (activePart == "my-homework" ? "active" : "")}
            onClick={() => changeActivePart("my-homework")}
          >
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/steps' + (activePart == "my-homework" ? "_white":"") + '.svg')} className='desktop'/>
            </td>
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/steps'+(activePart == "my-homework" ? '_active':'')+'.svg')} className='phone'/>
              <span>{homeworkTitle}</span>
            </td>
          </tr>
        </>
        :
        <>
          <tr
            className={"lessons " + (activePart == "lessons" ? "active" : "")}
            onClick={() => changeActivePart("lessons")}
          >
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/steps' + (activePart == "lessons" ? "_white":"") + '.svg')} className='desktop'/>
            </td>
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/steps'+(activePart == "lessons" ? '_active':'')+'.svg')} className='phone'/>
              <span>{modulesTitle}</span>
            </td>
          </tr>
        </>
      }
      {intervention.settings.goals.length > 0 ?
        <tr className='spacer'><td></td><td></td></tr>
        : <></>}
      {intervention.settings.goals.length > 0 ?
        <tr
          onClick={() => changeActivePart("goals")}
          className={"goals " + (activePart == "goals" || activePart == "goal" || activePart == "goal-edit" ? "active" : "")}
        >
          <td>
            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/goals' + (activePart == "goals" || activePart == "goal" || activePart == "goal-edit" ? "_white":"") + '.svg')} className='desktop'/>
          </td>
          <td>
            <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/goals'+(activePart == "goals" ? '_active':'')+'.svg')} className='phone'/>
            <span>{objectivesTitle}</span>
          </td>
        </tr>
        : <></>}
      <tr className='spacer'><td></td><td></td></tr>

      {
        //Dagboek?
        (typeof intervention.settings !== "undefined" && typeof intervention.settings.include_journal !== "undefined" &&  intervention.settings.include_journal === 1) ?
          <>
            <tr
              onClick={() => changeActivePart("journal")}
              className={"journal " + (activePart == "journal" ? "active" : "")}
            >
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/diary' + (activePart == "journal" ? "_white":"") + '.svg')} className='desktop'/>
              </td>
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/diary'+(activePart == "journal" ? '_active':'')+'.svg')} className='phone'/>
                <span>{journalTitle}</span>
              </td>
            </tr>
            <tr className='spacer'><td></td><td></td></tr>
          </> : <></>
      }

      {
        //Stressmeter?
        (typeof intervention.settings !== "undefined" && typeof intervention.settings.include_stress_meter !== "undefined" &&  intervention.settings.include_stress_meter === 1) ?
          <>
            <tr
              onClick={() => changeActivePart("stress")}
              className={"stress " + (activePart == "stress" ? "active" : "")}
            >
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/stress' + (activePart == "stress" ? "_white":"") + '.svg')} className='desktop'/>
              </td>
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/stress'+(activePart == "stress" ? '_active':'')+'.svg')} className='phone'/>
                <span>{stressTitle}</span>
              </td>
            </tr>
            <tr className='spacer'><td></td><td></td></tr>
          </> : <></>
      }
      {
          (typeof intervention.settings !== "undefined" && typeof intervention.settings.selfhelp.guided_selfhelp_chat_contact !== "undefined" &&  intervention.settings.selfhelp.guided_selfhelp_chat_contact === 1 && auth.coachSupport) ?
          <>
            <tr
              onClick={() => changeActivePart("chat")}
              className={"chat " + (activePart == "chat" ? "active" : "")}
            >
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chat' + (activePart == "chat" ? "_white":"") + '.svg')} className='desktop'/>
              </td>
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chat'+(activePart == "chat" ? '_active':'')+'.svg')} className='phone'/>
                <span>{coachTitle}</span>

                {intervention.settings.numberOfNewMessages > 0 ?
                  <div className='newMessage'>
                    {intervention.settings.numberOfNewMessages}
                  </div>
                  : <></>}
              </td>
            </tr>
            <tr className='spacer'><td></td><td></td></tr>
          </>
          :false
      }
      {
          liveChatAvailable && auth.coachSupport ?
          <>
            <tr
              onClick={() => changeActivePart("live-chat")}
              className={"chat " + (activePart == "live-chat" ? "active" : "")}
            >
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chat' + (activePart == "live-chat" ? "_white":"") + '.svg')} className='desktop'/>
              </td>
              <td>
                <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chat'+(activePart == "live-chat" ? '_active':'')+'.svg')} className='phone'/>
                <span>{liveChatTitle}</span>

                {/*intervention.settings.numberOfNewMessages > 0 ?
                  <div className='newMessage'>
                    {intervention.settings.numberOfNewMessages}
                  </div>
                  : <></>*/}
              </td>
            </tr>
            <tr className='spacer'><td></td><td></td></tr>
          </>
          :false
      }
      {intervention.settings.intervention_type == "chatcourse" ?
        <>
          <tr
            onClick={() => changeActivePart("chatarchive")}
            className={"chatarchive " + (activePart == "chatarchive" ? "active" : "")}
          >
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chatarchive' + (activePart == "chatarchive" ? "_white":"") + '.svg')} className='desktop'/>
            </td>
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chatarchive'+(activePart == "chatarchive" ? '_active':'')+'.svg')} className='phone'/>
              <span>{chatarchiveTitle}</span>
            </td>
          </tr>
          <tr className='spacer'><td></td><td></td></tr>
        </>
        :<></>}
      {intervention.settings.pages.length > 0 ?
        <Fragment>
          <tr
            onClick={() => changeActivePart("more")}
            className={"more " + ("desktop " + (activePart == "more" || activePart == "page" ? "active" : ""))}
          >
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/more' + (activePart == "more" || activePart == "page" ? "_white":"") + '.svg')} className='desktop'/>
            </td>
            <td>
              <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/chat'+(activePart == "more" ? '_active':'')+'.svg')} className='phone'/>
              <span>{t("Meer")}</span>
            </td>
          </tr>
        </Fragment>
      :false}
      <tr className='spacer'><td></td><td></td></tr>

      <tr className={"phone" + ((activePart == "more" || activePart == "page") ? " active" : "")}onClick={()=>toggleMenu()}>
        <td></td>
        <td>
          <img src={require('../../../custom/themes/'+appSettings.baseThemeID+'/images/more.svg')} className='phone'/>
          <span>{t("Meer")}</span>
        </td>
      </tr>
    </tbody>
    </table>
    </div>
  )
}

export default MenuItems;
