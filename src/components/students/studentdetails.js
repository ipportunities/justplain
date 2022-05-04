import React, { useState, useEffect } from "react";
import DynamicContent from "./studentDetails/dynamiccontent.js";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import t from "../translate";

const StudentDetails = props => {

    const auth = useSelector(state => state.auth);
    const intervention = useSelector(state => state.intervention);
    const [navtab, setNavtab] = useState("");
    const [selfRegisterd, setSelfRegisterd] = useState(false);
    const [unreadMessage, setUnreadMessage] = useState(false);
    const [unseenLesson, setUnseenLesson] = useState(false);
    const [unseenHomework, setUnseenHomework] = useState(false);
    const [dynamicContentType, setDynamicContentType] = useState("");
    const history = useHistory();

    useEffect(() => {
      if(props.goTo != ""){
        navigateTo(props.goTo)
      } else {
        navigateTo('info')
      }
      if(props.user.registration){
        setSelfRegisterd(props.user.registration)
      } else {
        setSelfRegisterd(false)
      }
      if (typeof props.user.unread_message !== undefined)
      {
        setUnreadMessage(props.user.unread_message);
      }
      if (typeof props.user.unseen_lesson !== undefined)
      {
        setUnseenLesson(props.user.unseen_lesson);
      }

        //setNavtab("info")
        //setDynamicContentType("info")
    }, [props.studentId, props.goTo, props.user.registration]);

    const navigateTo = gotab => {
        if (navtab !== gotab) {
            setNavtab(gotab);
            setDynamicContentType(gotab);

            ///check intervention type
            if(intervention.settings.intervention_type === "chatcourse" && auth.userType == "coach"){
                history.push("/dashboard/" + intervention.id + "/students/" + props.studentId + "/" + gotab)
            } else {
                /// TODO voor de gewone students view nog inrichten
                //history.push( "/students/" + intervention.id + "/" + props.studentId + "/" + gotab)
            }

        }
      };

    const toListView = () => {
        if(intervention.settings.intervention_type === "chatcourse"){
            props.setStudentId(0)
            history.push("/dashboard/" + intervention.id + "/students/")
        }
        props.setDetailsVisible(false)
      };

    return (
        <div>

    <div className="student_details">
        {typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "chatcourse" && typeof props.user.firstname != "undefined" ?
            <>
              {auth.userType == "coach" ?
                <i className="fas fa-angle-left backToList" onClick={()=>toListView()}></i>
              :<></>}
              <h2>{props.user.firstname + " " + props.user.insertion + " " + props.user.lastname}</h2>
            </>
        :<></>}
        <div className="navbarHolder">
        <table >
            <tbody>
                <tr>
                    <td className='filterd'>

                    </td>
                    <td>
                    <nav className="navbar navbar-intervention-settings navbar-expand-lg navbar-light">
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                        <span id="settings-navbar-info" className={(navtab == "info") ? "nav-item nav-link active" : "nav-item nav-link"}
                            onClick={() => {navigateTo("info");}}>
                            {t("Profiel")}
                        </span>
                        {typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "chatcourse" ?
                          <>
                            <span id="settings-navbar-group" className={(navtab == "group") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("group");}}>
                                {t("Groep")}
                            </span>
                            <span id="settings-navbar-homework" className={(navtab == "homework") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("homework");}}>
                                {t("Huiswerk")}
                            </span>
                          </>
                          :<></>
                        }
                        {selfRegisterd ?
                          <span id="settings-navbar-registration" className={(navtab == "registration") ? "nav-item nav-link active" : "nav-item nav-link"}
                              onClick={() => {navigateTo("registration");}}>
                              {t("Aanmeld data")}
                          </span>
                          :''}
                          <span className={(intervention.hasOwnProperty("settings") && typeof intervention.settings.homework != "undefined" && intervention.settings.homework.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_lessons === 1  && intervention.settings.intervention_type == "chatcourse") ? '' : 'hidden'}>
                              <span id="settings-navbar-homework" className={(navtab == "lessons") ? "nav-item nav-link active" : "nav-item nav-link"}
                                  onClick={() => {navigateTo("homework");}}>
                                  {t("Huiswerk")}
                                  &nbsp; <span className={(unseenHomework) ? 'badge badge-warning' : 'hidden'} id={'chatBadge_profile_'+props.user.id}><i className="fas fa-atlas"></i></span>
                              </span>
                          </span>
                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_chat_contact === 1) ? '' : 'hidden'}>
                            <span id="settings-navbar-chat" className={(navtab == "chat") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("chat");}}>
                                {t("Verstuur bericht")}
                                &nbsp; <span className={(unreadMessage) ? 'badge badge-success' : 'hidden'} id={'chatBadge_profile_'+props.user.id}><i className="far fa-comments"></i></span>
                            </span>
                        </span>

                        {(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_live_chat === 1) ?
                            <span>
                                <span id="settings-navbar-chat" className={(navtab == "live-chat") ? "nav-item nav-link active" : "nav-item nav-link"}
                                    onClick={() => {navigateTo("live-chat");}}>
                                    {t("Live chat")}
                                    {/*
                                      &nbsp; <span className={(unreadMessage) ? 'badge badge-success' : 'hidden'} id={'chatBadge_profile_'+props.user.id}><i className="far fa-comments"></i></span>
                                    */}
                                </span>
                            </span>
                         : false}

                       {(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_plan_contact === 1) ?
                           <span>
                               <span id="settings-navbar-plan-contact" className={(navtab == "plan-contact") ? "nav-item nav-link active" : "nav-item nav-link"}
                                   onClick={() => {navigateTo("plan-contact");}}>
                                   {t("Afspraak inplannen")}
                                   {/*
                                     &nbsp; <span className={(unreadMessage) ? 'badge badge-success' : 'hidden'} id={'chatBadge_profile_'+props.user.id}><i className="far fa-comments"></i></span>
                                   */}
                               </span>
                           </span>
                        : false}

                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.include_stress_meter === 1) ? '' : 'hidden'}>
                            <span id="settings-navbar-stress" className={(navtab == "stress") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("stress");}}>
                                {t("Stress")}
                            </span>
                        </span>
                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.include_journal === 1) ? '' : 'hidden'}>
                            <span id="settings-navbar-stress" className={(navtab == "journal") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("journal");}}>
                                {t("Dagboek")}
                            </span>
                        </span>
                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.lessons.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_lessons === 1  && intervention.settings.intervention_type != "chatcourse") ? '' : 'hidden'}>
                            <span id="settings-navbar-lessons" className={(navtab == "lessons") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("lessons");}}>
                                {t("Lessen")}
                                &nbsp; <span className={(unseenLesson) ? 'badge badge-warning' : 'hidden'} id={'chatBadge_profile_'+props.user.id}><i className="fas fa-atlas"></i></span>
                            </span>
                        </span>
                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.questionnaires.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_questionnaires === 1) ? '' : 'hidden'}>
                            <span id="settings-navbar-questionnaires" className={(navtab == "questionnaires") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("questionnaires");}}>
                                {t("Vragenlijsten")}
                            </span>
                        </span>
                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.goals.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_goals === 1) ? '' : 'hidden'}>
                            <span id="settings-navbar-goals" className={(navtab == "goals") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("goals");}}>
                                {t("Doelen")}
                            </span>
                        </span>
                        <span
                          className={ (intervention.hasOwnProperty('settings') && typeof intervention.settings.generatableExamTypes != "undefined" &&  intervention.settings.generatableExamTypes.length > 0) ? '' : 'hidden' }>
                              <span id="settings-navbar-generatableExamTypes"
                                    className={ (navtab === 'generatableExamTypes') ? 'nav-item nav-link active' : 'nav-item nav-link' }
                                    onClick={ () => {navigateTo('generatableExamTypes')} }>
                                  { t('Examens') }
                              </span>
                          </span>
                        <span className={(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_view_log === 1) ? '' : 'hidden'}>
                            <span id="settings-navbar-log" className={(navtab == "log") ? "nav-item nav-link active" : "nav-item nav-link"}
                                onClick={() => {navigateTo("log");}}>
                                {t("Log")}
                            </span>
                        </span>
                        </div>
                    </div>
                    </nav>
                    </td>
                </tr>
            </tbody>
        </table>
        </div>

        <div className="dynamic_content">
            <DynamicContent studentId={props.studentId} dynamicContentType={dynamicContentType} user={props.user} interventions={props.interventions} coaches={props.coaches} setUnreadMessage={setUnreadMessage} setUnreadMessageMain={props.setUnreadMessage} setUnseenLessonMain={props.setUnseenLesson} setState={props.setState} state={props.state} />
        </div>
    </div>
        </div>
    )
}

export default StudentDetails;
