import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import $ from "jquery";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import { getClone } from "../utils";
import LeftMenu from "../dashboard/leftmenu";
import Modal from "../modal";
import Edituser from "./edituser.js";
import StudentDetails from "./studentdetails.js";
import t from "../translate";
import { setIntervention } from "../../actions";
import { Scrollbars } from 'react-custom-scrollbars';
import SortObjectArray from "../helpers/sortObjectArray.js";
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useLocation } from "react-router-dom";
import {appSettings} from "../../custom/settings";
import NotificationBox from "../alert/notification";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Students = (props) => {
  let location = useLocation();

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);

  const [supervisorFor, setSupervisorFor] = useState([]);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState({})
  const [userName, setUserName] = useState("")
  const [notificationOptions, setNotificationOptions] = useState('');

  //deze functie wordt als property doorgegeven aan modal en vandaar naar editUser
  //en aangeroepen na een geslaagde saveUser
  const closeModal = (msg, intervention_id) => {

    $("#user_add").modal("toggle");
    setMessage(msg);
    getUsers(intervention_id);
    setTimeout(() => {
      setMessage("");
    }, 5000);
  };

  const [studentId, setStudentId] = useState(0);

  const setCalled = (e, tx, user_id) => {

    e.stopPropagation();

    if (window.confirm(t("Heeft u deze deelnemer gebeld met het verzoek vragenlijst "+tx+" in te vullen? Klik dan op OK"))) {
      apiCall({
        action: "set_user_called",
        token: auth.token,
        data: {
          user_id,
          description: tx
        }
      }).then(resp => {
        if (resp.msg == 'OK')
        {
          let call = "call_"+tx;
          const newState = getClone(state);
          newState.users.find(user => user.id === user_id)[call] = false;
          setState(newState);
        }
        else
        {
          setErrorMessage(resp.msg);
        }
      });
    }

  }

  function getCoachId(userInterventions){
    let coach_id = false;
    ///get coach id this intervention
    let this_intervention_obj = userInterventions.filter(function (interv) {
      return interv.id === intervention.id
    });
    if(this_intervention_obj.length != 0){
      coach_id = this_intervention_obj[0].hasCoach;
    }
    return coach_id;
  }

  function getCoach(userInterventions) {
    let coach_id = getCoachId(userInterventions);

    if(coach_id){
      let this_coach_obj = coaches.filter(function (coach) {
        return coach.id === coach_id
      });
      if(this_coach_obj.length != 0){
        //return "#" + this_coach_obj[0].id + " " + this_coach_obj[0].login;
        return this_coach_obj[0].login;
      }
    }
  }

  const [groups, setGroups] = useState([])

  useEffect(() => {
    if(intervention.id > 0){
      let apiCallObj = {
        action: "get_groups_and_archived_groups_coach",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
        }
      };

      apiCall(apiCallObj).then(resp => {
        setGroups(resp.groups)
      });
    }

  }, [intervention.id]);

  const getGroup = (user) => {
    let thisIntervention = user.rights.interventions.filter(function (int) {
      return int.id === intervention.id
    });
    let thisInterventionIndex = user.rights.interventions.indexOf(thisIntervention[0])

    if(thisInterventionIndex >= 0){
      if(typeof user.rights.interventions[thisInterventionIndex].group_id != "undefined"){
        if(user.rights.interventions[thisInterventionIndex].group_id > 0){

          let group = groups.filter(function (group) {
            return group.id === user.rights.interventions[thisInterventionIndex].group_id
          });
          let groupIndex = groups.indexOf(group[0])

          if(groupIndex >= 0){
            let status = t("open");
            if(groups[groupIndex].status == "closed"){
              status = t("gesloten");
            }
            if(groups[groupIndex].status == "archive"){
              status = t("gearchiveerd");
            }
            return groups[groupIndex].title + " (" + status + ")"
          }
        }
      }
    }
  }
  const reSendRegistrationMail = (user) => {
    let apiCallObj = {
      action: "resend_registration_mail",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
        user_id: user.id,
      }
    };

    apiCall(apiCallObj).then(resp => {
      setNotificationOptions({
        show: "true",
        text: "<h4>"+t(resp.msg)+"</h4>",
        confirmText: t("Ok")
      });
    });
  }

  const getGroupID = (user) => {
    let thisIntervention = user.rights.interventions.filter(function (int) {
      return int.id === intervention.id
    });
    let thisInterventionIndex = user.rights.interventions.indexOf(thisIntervention[0])

    if(thisInterventionIndex >= 0){
      if(typeof user.rights.interventions[thisInterventionIndex].group_id != "undefined"){
        if(user.rights.interventions[thisInterventionIndex].group_id > 0){

          let group = groups.filter(function (group) {
            return group.id === user.rights.interventions[thisInterventionIndex].group_id
          });
          let groupIndex = groups.indexOf(group[0])

          if(groupIndex >= 0){
            return groups[groupIndex].id
          }
        }
      }
    }
  }

  //functie die lijst opmaakt met users
  const ListItems = props => {
    let users = state.users

    let searchForLowerCase = searchFor.toLowerCase()
    for (let i = 0; i < users.length; i++) {
      let name = users[i].firstname + " " + users[i].insertion +  " " + users[i].lastname ;
      if (!name.toLowerCase().includes(searchForLowerCase)) {
          users[i].hide = 'true'
      } else {
        users[i].hide = 'false'
      }
    }

    if(sort !== "") {
      users.sort(SortObjectArray(sort, sortDirection));
    }

    return (
      <table>
        <tbody>
          {props.showHeader ?
            <tr>
              <th className="pointer" onClick={() => changeSort("id")}>#</th>
              <th className="pointer" onClick={() => changeSort("firstname")}>{t("Naam")}</th>
              {typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "chatcourse" && !activeGroupID ?
                <>
                  <th>
                    {t("Groep")}
                  </th>
                </>
                :
                <>
                {(auth.userType == "admin" || supervisorFor.indexOf(intervention.id) > -1) && !activeGroupID ?
                  <>
                    <th>
                      {t(appSettings.begeleiderName)}
                    </th>
                    </>
                :<></>}
                </>
              }

              <th></th>
            </tr>
            :<tr className="hide"></tr>}
          {users.map((user, index) => {
              return (
                <React.Fragment key={index}>

                  {!activeGroupID || activeGroupID == parseInt(getGroupID(user)) ?
                    <>

                    <tr
                      key={user.id}
                      id={"user_" + user.id}
                      className={"pointer rowHover" + (user.id == studentId ? ' active':'') + (user.hide == 'true' ? ' hide':'') + (user.login === '' ? " not_registerd_yet" : "")}

                    >
                      <td onClick={() => props.showStudentDetails(user)}>{user.id}</td>
                      <td onClick={() => props.showStudentDetails(user)}>
                          {
                            (user.anonymous === 1) ?
                              <>{user.login}</>
                              :
                              <>
                                {user.firstname} {user.insertion} {user.lastname}
                                {
                                  typeof user.sinai_id !== "undefined" && user.sinai_id.length > 0 ?
                                    <span> &nbsp; (sinai-ID: {user.sinai_id})</span> : <></>
                                }
                              </>
                          }
                          &nbsp; <span className={(user.unread_message) ? 'badge badge-success' : 'hidden'}><i className="far fa-comments"></i></span>
                          &nbsp; <span className={(user.unseen_lesson) ? 'badge badge-warning' : 'hidden'}><i className="fas fa-atlas"></i></span>
                          &nbsp; <span className={(user.call_t1) ? 'badge badge-info' : 'hidden'} onClick={(e) => setCalled(e, 't1', user.id)} data-tip={user.phone}><i className="fas fa-phone-square-alt"></i> t1</span>
                          &nbsp; <span className={(user.call_t2) ? 'badge badge-info' : 'hidden'} onClick={(e) => setCalled(e, 't2', user.id)} data-tip={user.phone}><i className="fas fa-phone-square-alt"></i> t2</span>
                      </td>
                      {typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "chatcourse" && !activeGroupID ?
                        <>
                          <td className="group" onClick={() => props.showStudentDetails(user)}>
                            {getGroup(user)}
                          </td>
                        </>
                        :
                        <>
                        {auth.userType == "admin" || supervisorFor.indexOf(intervention.id) > -1 ?
                          <>
                          <td className="coachName" onClick={() => props.showStudentDetails(user)}>
                            {getCoach(user.rights.interventions)}
                          </td>
                            </>
                        : <></>}
                        </>
                      }
                      <td className='userActions'>
                        {intervention.id == 8 && user.login === '' ?
                          <i
                            className="fas fa-file-contract"
                            onClick={() => reSendRegistrationMail(user)}
                            data-tip={t("Verzend registratie mail")}
                            ></i>
                          :false}
                        <i
                          className="far fa-user-circle"
                          onClick={() => props.showStudentDetails(user, 'info')}
                          data-tip={t("Info")}
                        ></i>
                        {typeof intervention.settings.intervention_type != "undefined" && intervention.settings.intervention_type === "chatcourse" ?
                          <>
                          <i
                            className="fas fa-users"
                            onClick={() => props.showStudentDetails(user, 'group')}
                            data-tip={t("Groep")}
                          ></i>
                          {(intervention.hasOwnProperty("settings") && typeof intervention.settings.homework != "undefined" && intervention.settings.homework.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_homework === 1) ?
                            <i
                              className="fas fa-atlas"
                              onClick={() => props.showStudentDetails(user, 'homework')}
                              data-tip={t("Huiswerk")}
                            ></i>
                            : ''}
                            <i
                              className="fas fa-mail-bulk"
                              onClick={() => props.showStudentDetails(user, 'chat')}
                              data-tip={t("Verstuur bericht")}
                            ></i>
                          </>
                          :
                          <></>
                        }
                        {(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_chat_contact === 1) && intervention.settings.intervention_type != "chatcourse"  ?
                          <i
                            className="far fa-paper-plane"
                            onClick={() => props.showStudentDetails(user, 'chat')}
                            data-tip={t("Berichten")}
                          ></i>
                        : ''}
                        {(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_live_chat === 1) && intervention.settings.intervention_type != "chatcourse"  ?
                          <i
                            className="far fa-comments"
                            onClick={() => props.showStudentDetails(user, 'live-chat')}
                            data-tip={t("Live chat")}
                          ></i>
                        : ''}

                        {(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.guided_selfhelp_plan_contact === 1)  ?
                          <i
                            className="far fa-calendar-alt"
                            onClick={() => props.showStudentDetails(user, 'plan-contact')}
                            data-tip={t("Afspraak inplannen")}
                          ></i>
                        : ''}

                        {(intervention.hasOwnProperty("settings") && intervention.settings.include_stress_meter === 1) ?
                          <i
                            className="fas fa-chart-area"
                            onClick={() => props.showStudentDetails(user, 'stress')}
                            data-tip={t("Stressmeter")}
                          ></i>
                        : ''}

                        {(intervention.hasOwnProperty("settings") && intervention.settings.include_journal === 1) ?
                          <i
                            className="fas fa-book  "
                            onClick={() => props.showStudentDetails(user, 'journal')}
                            data-tip={t("Dagboek")}
                          ></i>
                        : ''}

                        {(intervention.hasOwnProperty("settings") && intervention.settings.selfhelp.lessons.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_lessons === 1 && intervention.settings.intervention_type != "chatcourse") ?
                          <i
                            className="fas fa-atlas"
                            onClick={() => props.showStudentDetails(user, 'lessons')}
                            data-tip={t("Lessen")}
                          ></i>
                          : ''}

                        {(intervention.hasOwnProperty("settings") && intervention.settings.goals.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_goals === 1) ?
                          <i
                            className="fas fa-bullseye"
                            onClick={() => props.showStudentDetails(user, 'goals')}
                            data-tip={t("Doelen")}
                          ></i>
                          : ''}

                        {(intervention.hasOwnProperty("settings") && intervention.settings.questionnaires.length > 0 && intervention.settings.selfhelp.guided_selfhelp_view_questionnaires === 1) ?
                          <i
                            className="far fa-list-alt"
                            onClick={() => props.showStudentDetails(user, 'questionnaires')}
                            data-tip={t("Vragenlijsten")}
                          ></i>
                          : ''}

                        { (intervention.hasOwnProperty('settings') && typeof intervention.settings.generatableExamTypes != "undefined" &&  intervention.settings.generatableExamTypes.length > 0) ?
                          <i
                            className="fa fa-tasks"
                            onClick={ () => props.showStudentDetails(user, 'generatableExamTypes') }
                            data-tip={ t('Exams') }
                          />
                          : '' }

                      {/*<i className="far fa-trash-alt"></i>*/}
                        <ReactTooltip place="top" effect="solid" delayShow={200} />
                      </td>
                    </tr>

                    </>
                    : <></>}
                    </React.Fragment>
                  );
          })}
        </tbody>
      </table>
    );
  };


  const [state, setState] = useState({
    users: [],
    modalState: {
      name: "user_add",
      label: "user_edit_label",
      title: "",
      component: Edituser,
      btnValue: t("Opslaan"),
      componentData: {
        user: {
          id: 0,
          sinai_id: "",
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
          removeUser: false,
          anoymous: 0
        },
        closeModal: closeModal,
      }
    }
  });

  useEffect(() => {
      /// direct aanroep student via url mogelijk maken vanuit groepen lijst 2021-12-9
    if(props.studentId){
      let studentToShow = state.users.find(user => user.id === props.studentId)

      ///get student with this id
      if(studentToShow){
        showStudentDetails(studentToShow)
        setGoTo(props.studentTab)
      }
    }
    ////terug naar de list view na klik op dashboard menu
    if(props.studentId == ""){
      closeDetails()
    }
  }, [props.studentId, state.users]);

  const getUsers = (intervention_id) => {
    //api aanroepen
    apiCall({
      action: "get_students",
      token: auth.token,
      data: {
        intervention_id: intervention_id
      }
    }).then(resp => {
      const newState = getClone(state);
      newState.users = resp.students;
      setState(newState);
    });


  };

  const [coaches, setCoaches] = useState([])

  useEffect(() => {
    if(intervention.id && (supervisorFor.indexOf(intervention.id) > -1 || auth.userType == "admin"))
    {
      //api aanroepen
      apiCall({
        action: "get_coaches",
        token: auth.token,
        data: {
          intervention_id: intervention.id
        }
      }).then(resp => {
        setCoaches(resp.users);
      });
    }
  }, [intervention.id, auth, supervisorFor]);

  const handleScroll = (event) => {
    let scrollTop = $(document).scrollTop();
    if(scrollTop > 180){
      $(".coachInterface").addClass("navScrolledTop")
    } else {
      $(".coachInterface").removeClass("navScrolledTop")
    }
  }

  const [interventions, setInterventions] = useState([])
  const [activeGroupID, setActiveGroupID] = useState(false)

  let scrollbarRef = useRef()

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {

    if(props.interventions != ""){
      setInterventions(props.interventions)
    }

    if(typeof props.activeGroup != "undefined"){
      setActiveGroupID(props.activeGroup.id)
    }

    window.addEventListener('scroll', handleScroll);

  }, [props]);

  useEffect(() => {
    let intervention_id = location.pathname.split("/")[2];
    if(auth.userType == "admin"){
      intervention_id = location.pathname.split("/")[3];
    }

    //api aanroepen om settings op te halen
    getInterventionSettings(intervention_id)

    if(auth.userType == "coach"){
      let localSupervisorFor = [];
      auth.rights.interventions.forEach(function (interv, index) {
        if (interv.isSupervisor)
        {
          localSupervisorFor.push(interv.id);
        }
      });
      setSupervisorFor(localSupervisorFor);
    }

  }, [auth]);


  const getInterventionSettings = (intervention_id) => {

    apiCall({
      action: "get_intervention_settings",
      token: auth.token,
      data: {
        intervention_id,
        include_forms: true, //tijdelijk...
        language_id: uiTranslation.language_id

      }
    }).then(resp => {
      //set settings in global state:
      dispatch(
        setIntervention(
          intervention_id,
          resp.organisation_id,
          resp.title,
          resp.settings
        )
      );
      getUsers(intervention_id);
    });

  }

  //deze functie wordt aangeroepen bij aanklikken van een user in de list (ListItems)
  const setStateCallback = (user, title) => {
    let newState = getClone(state);
    newState.modalState.componentData.user = user;
    newState.modalState.title = title;
    setState(newState);
  };

  const addUser = () => {
    let eighteenyrold = (Date.now()/1000) - 567993600;
    setStateCallback(
      {
        id: 0,
        sinai_id: "",
        firstname: "",
        insertion: "",
        lastname: "",
        email: "",
        phone: "",
        date_time_birth: eighteenyrold,
        gender: "",
        education: "",
        organisation_id: intervention.organisation_id,
        type: "student",
        login: "",
        password: "",
        password_check: "",
        rights: {
          interventions: [
            {
              id: intervention.id
            }
          ]
        },
        preference: {}
      },
      t("Toevoegen deelnemer")
    );
    $("#user_add").modal("toggle");
    $("#firstname").focus();
  };

  //// ideetje tbv visueel hulpmiddeltje dat je kan zien dat je kan scrollen
  //const [scrollIconList, setScrollIconList] = useState(false)

  const [goTo, setGoTo] = useState('')

  const showStudentDetails = (student, toTab = '') => {

    setStudentId(student.id);
    setDetailsVisible(true)
    setOpenSearch(false)
    setGoTo(toTab)

    apiCall({
        action: "get_student",
        token: auth.token,
        data: {
          user_id: student.id,
          intervention_id: intervention.id
        }
      }).then(resp => {
        setUser(resp.user);
        setUserName(resp.user.firstname + " " + resp.user.insertion + " " + resp.user.lastname)
        var myElement = document.getElementById('user_'+student.id);
        if(myElement){
          var topPos = myElement.offsetTop;
          scrollbarRef.current.scrollTop(topPos);
        }

        //// ideetje tbv visueel hulpmiddeltje dat je kan zien dat je kan scrollen <= nog een keertje naar kijken nu even uitgezet ben nog niet overtuigerd
        /*
        let scrollHeight = scrollbarRef.current.view.scrollHeight
        let offsetHeight = scrollbarRef.current.view.offsetHeight
        let scrollTop = scrollbarRef.current.view.scrollTop

        if((offsetHeight + scrollTop) < scrollHeight){
          setScrollIconList("down")
        } else if((scrollHeight + scrollTop) > offsetHeight) {
          setScrollIconList("up")
        } else {
          setScrollIconList(false)
        }*/
      });
  }

  const [detailsVisible, setDetailsVisible] = useState(false)

  const closeDetails = () => {
    setDetailsVisible()
    setUserName("")
    window.scrollTo(0, 0);

  }
  const searchView = () => {
    setUserName('');
    setOpenSearch(true)
    setDetailsVisible(false)
  }

  const [openSearch, setOpenSearch] = useState(false)
  const [searchFor, setSearchFor] = useState("")
  const [sort, setSort] = useState("")
  const [sortDirection, setSortDirection] = useState("")

  function changeSort(type){
    setSortDirection(sortDirection == "asc" ? "desc":"asc")
    setSort(type)
  }

  function changeIntervention(int_id){

    let this_intervention_obj = interventions.filter(function (intervention) {
      return intervention.id === int_id
    });
    if(this_intervention_obj.length != 0){

      history.push("/students/" + int_id)
      getInterventionSettings(int_id)
      closeDetails()
    }

  }

  const setUnreadMessage = (user_id, unreadMessage) => {

    const newState = getClone(state);
    newState.users.find(user => user.id === user_id).unread_message = unreadMessage;
    setState(newState);

  }

  const setUnseenLesson = (user_id, unseenLesson) => {
    const newState = getClone(state);
    newState.users.find(user => user.id === user_id).unseen_lesson = unseenLesson;
    setState(newState);

  }

  return (
    <div className={"coachInterface students" + (openSearch ? ' openSearch':'')}>
      {!activeGroupID ?
        <nav className="navbar navbar-expand-lg navbar-light">
        {auth.userType == 'admin' ?
          <h2 className='select' onClick={(e) => history.push("/intervention/edit/" + intervention.id + "/general/")}>
            {intervention.title}
          </h2>
          :
          <h2 className='select'>
            <select value={intervention.id} onChange={(e) => changeIntervention(e.target.value)}>
              {interventions.map((int, index) => (
                <option value={int.id} key={index}>
                  {int.title}
                </option>
              ))}
            </select>
            {intervention.title}
          </h2>
        }

          {/*
          <select value={intervention.id} onChange={(e) => changeIntervention(e.target.value)}>
            {interventions.map((int, index) => (
              <option value={int.id} key={index}>
                {int.title}
              </option>
            ))}
          </select>*/}

          <h2 className="noPadding">
            <span className="pointer" onClick={()=>closeDetails()}> &nbsp;> {t("deelnemers")}</span>
            { userName != "" ? " > " + userName  :''}
          </h2>
        </nav>
        :<></>}

      <div className={'list list' + (detailsVisible ? 'Visible':'Hidden') }>
        <LeftMenu />
        <table className="theIntervention">
          <tbody>
            <tr>
              <td>
                {!props.studentId ?
                  <>
                  {!activeGroupID ?
                    <h2>{t('Deelnemers')}</h2>
                    :<h4>{t('Deelnemers')}</h4>}
                  </>
                  :<></>}

                {searchFor != "" && !openSearch ?
                  <span className="btn btn-secondary filter" onClick={()=>setSearchFor("")}>
                    {searchFor} <i className="fas fa-times"></i>
                  </span>
                :''}
              </td>
              <td className="options">
                {!appSettings.included && !props.noAdd?
                  <button className="btn btn-primary btn-sm btn-trans" onClick={addUser}>
                    <i className="fas fa-plus"></i>
                  </button>
                :false}
                {!props.noAdd ?
                  <>
                    <i className={"fas fa-search pointer" + (openSearch ? ' hide':' ')} onClick={()=>searchView()}></i>
                    <div className="search">
                      <input type="text" value={searchFor} placeholder={t("Zoek deelnemer")} onChange={(e) => setSearchFor(e.target.value)}/>
                      <i className="far fa-times-circle pointer" onClick={()=>setOpenSearch(false)}></i>
                    </div>
                  </>
                  :
                  <></>
                }
              </td>
            </tr>
          </tbody>
        </table>
        <table className='holder'>
          <tbody>
            <tr>
              <td className="left">
              {
                detailsVisible
              }
                {detailsVisible && !props.studentId ?
                  <div className="users" id="user_details_list">
                    <Scrollbars
                    ref={scrollbarRef}
                    style={{ width: "100%", height: "calc(100vh - 193px)" }}
                    autoHide
                    renderTrackHorizontal={props => <div {...props} className="track-horizontal" style={{display:"none"}}/>}
                    renderThumbHorizontal={props => <div {...props} className="thumb-horizontal" style={{display:"none"}}/>}
                    >
                    <ListItems state={state} setStateCallback={setStateCallback} showStudentDetails={showStudentDetails}/>
                    </Scrollbars>
                    {/*scrollIconList ?
                      <div className={"youCanScroll " + scrollIconList}>
                        <i className="fas fa-chevron-up"></i>
                      </div>
                      :''*/}
                  </div>
                  :
                  <>
                  {!props.studentId ?
                    <div className="users">
                      <ListItems
                      showHeader={true}
                      state={state}
                      setStateCallback={setStateCallback} showStudentDetails={showStudentDetails}/>
                    </div>
                    :<></>}
                  </>
                }
              </td>
              <td className="details">
                {detailsVisible ?
                  <StudentDetails studentId={studentId} user={user} goTo={goTo} interventions={interventions} coaches={coaches} setUnreadMessage={setUnreadMessage} setUnseenLesson={setUnseenLesson} setState={setState} state={state} setDetailsVisible={setDetailsVisible} setStudentId={props.setStudentId}/>
                  :''}
              </td>
            </tr>
          </tbody>
        </table>

        <div
          className={message.length < 1 ? "alert" : "alert alert-success"}
          role="alert"
        >
          {message}
        </div>
        <div
          className={errorMessage.length < 1 ? "alert" : "alert alert-danger"}
          role="alert"
        >
          {errorMessage}
        </div>

        <Modal {...state.modalState} />
    </div>
    <NotificationBox options={notificationOptions} setNotificationOptions={setNotificationOptions} />
    </div>
  );
};

export default Students;
