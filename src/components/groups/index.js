import React, { useState, useEffect } from "react";
import t from "../translate";
import uuid from "uuid";
import {appSettings} from "../../custom/settings";
import { useSelector, useDispatch } from "react-redux";
import { setSavingStatus } from "../../actions";
import apiCall from "../api";
import { getClone } from "../utils";
import ConfirmBox from "../alert/confirm";
import Navbar from "./navbar.js";
import ChatArchive from "./chat_archive.js";
import SendMessage from "./message.js";
import Agenda from "./agenda.js";
import StartChat from "./start_chat.js";
import Settings from "./settings.js";
import Log from "./log.js";
import Students from "./students.js";
import Addgroup from "./addgroup";
import Modal from "../modal";
import SortObjectArray from "../helpers/sortObjectArray.js";
import $ from "jquery";
import ReactTooltip from "react-tooltip";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

let editGroupTitleTimeOut = null;
let editGroupStatusTimeOut = null;
let time = 300;

const Groups = props => {

  let location = useLocation();

  const dispatch = useDispatch();

  const intervention = useSelector(state => state.intervention);
  const auth = useSelector(state => state.auth);

  const [detailsView, setDetailsView] = useState(false)
  const [groups, setGroups] = useState([])
  const history = useHistory();

  const [mainSuccessMessage, setMainSuccessMessage] = useState("")
  const [mainErrorMessage, setMainErrorMessage] = useState("")

  useEffect(() => {
    if(props.activeGroup == ""){
      setDetailsView(false)
      props.setActiveGroup(false)
    }
  }, [props.activeGroup, location]);

  ///direct load from url
  useEffect(() => {
    if(location.pathname.split("/")[5] && groups.length > 0){
      let groupToShow = groups.find(group => group.id === location.pathname.split("/")[4])
      ///get group with this id
      if(groupToShow){
        props.setActiveGroup(groupToShow)
        setActiveTab(location.pathname.split("/")[5])
        setDetailsView(true)
      }

    }
  }, [location, groups, props.activeGroup]);

  useEffect(() => {
    if(intervention.id > 0){
      getGroups()
    }

  }, [intervention.id]);

  const getGroups = () => {
    let apiCallObj = {
      action: "get_groups_coach",
      token: auth.token,
      data: {
        intervention_id: intervention.id,
      }
    };

    apiCall(apiCallObj).then(resp => {
      setGroups(resp.groups)
      setDetailsView(false)
      props.setActiveGroup(false)
    });

  }

  const addGroup = (e) => {
    $("#group_add").modal("toggle");
  }

  const [confirmOptions, setConfirmOptions] = useState({});

  function deleteGroupConfirm(group_id) {
    let confirmOptionsToSet = {
      show: "true",
      text: t("Weet u zeker dat u deze groep definitief wilt verwijderen?")+"</h4>",
      cancelText: t("Annuleer"),
      confirmText: t("Verwijder"),
      confirmAction: () => deleteGroup(group_id)
    };
    setConfirmOptions(confirmOptionsToSet);
  }

  const deleteGroup = (group_id) => {
    dispatch(setSavingStatus("not_saved"))
    apiCall({
      action: "delete_group",
      token: auth.token,
      data: {
        group_id,
      }
    }).then(resp => {
      if (resp.msg == 'OK') {
        dispatch(setSavingStatus("saved"))
        setGroups(resp.groups)
        setMainSuccessMessage("De groep is verwijderd.")
        setTimeout(setMainSuccessMessage(""), 2000)
      } else {
        setMainErrorMessage(resp.msg);
      }
    })
  }

  const updateGroupTitle = (title, group_id, setErrorMessage) => {

    dispatch(setSavingStatus("not_saved"))

    clearTimeout(editGroupTitleTimeOut);

    editGroupTitleTimeOut = setTimeout(() => {

      apiCall({
        action: "edit_group_title",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id,
          title
        }
      }).then(resp => {
        if (resp.msg == 'OK') {
          dispatch(setSavingStatus("saved"))
          setGroups(resp.groups)
          let newActiveGroup = {...props.activeGroup}
          newActiveGroup.title = title
          props.setActiveGroup(newActiveGroup)
        } else {
          setErrorMessage(resp.msg);
        }
      })

    }, 1000);

  }

  const updateGroupStatus = (status, group_id, setErrorMessage) => {

    dispatch(setSavingStatus("not_saved"))

    clearTimeout(editGroupStatusTimeOut);

    editGroupStatusTimeOut = setTimeout(() => {

      apiCall({
        action: "change_status_group",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
          group_id,
          status
        }
      }).then(resp => {
        if (resp.msg == 'OK') {
          dispatch(setSavingStatus("saved"))
          setGroups(resp.groups)
          let newActiveGroup = {...props.activeGroup}
          newActiveGroup.status = status
          props.setActiveGroup(newActiveGroup)
        } else {
          setErrorMessage(resp.msg);
        }
      })

    }, 1000);

  }

  /* const saveGroups = (groups, intervention_id) => {
    dispatch(setSavingStatus("not_saved"));
    clearTimeout(saveSettingsTimeout);
    saveSettingsTimeout = setTimeout(() => {
      let apiCallObj = {
        action: "save_groups",
        token: auth.token,
        data: {
          intervention_id: intervention_id,
          groups: groups
        }
      };

      apiCall(apiCallObj).then(resp => {
        dispatch(setSavingStatus("saved"));
        setGroups(resp.groups)
      });
    }, time);
  } */

  const saveNewGroup = (intervention_id, name, setErrorMessage) => {

    apiCall({
      action: "add_group",
      token: auth.token,
      data: {
        intervention_id: intervention_id,
        name
      }
    }).then(resp => {
      if (resp.msg == 'OK') {
        $("#group_add").modal("toggle")
        dispatch(setSavingStatus("saved"))
        setGroups(resp.groups)
      } else {
        setErrorMessage(resp.msg)
      }
    })

  }

  const [activeTab, setActiveTab] = useState('')

  /*
  useEffect(() => {
    console.log('props.activeGroup', props.activeGroup)
  }, [props.activeGroup])
*/
  const showTab = (tab, group = false) => {
    if(group) {
      props.setActiveGroup(group);
      history.push("/dashboard/" + intervention.id + "/groups/" + group.id + "/" + tab + "/");
    }

    setActiveTab(tab);
    setDetailsView(true)


  }

  const toListView = () => {
    getGroups()
    history.push("/dashboard/" + intervention.id + "/groups/");
  }

  const [openSearch, setOpenSearch] = useState(false)
  const [searchFor, setSearchFor] = useState("")
  const [sort, setSort] = useState("")
  const [sortDirection, setSortDirection] = useState("")

  function changeSort(type){
    setSortDirection(sortDirection == "asc" ? "desc":"asc")
    setSort(type)
  }

  const searchView = () => {
    //setUserName('');
    setOpenSearch(true)
    //setDetailsVisible(false)
  }

  const closeModal = (msg, intervention_id) => {

    $("#group_add").modal("toggle");
    //setMessage(msg);
    //getUsers(intervention_id);
    setTimeout(() => {
      //setMessage("");
    }, 5000);
  };

  const [modalData, setModalData] = useState({
    name: "group_add",
    label: "user_edit_label",
    title: t("Voeg groep toe"),
    component: Addgroup,
    btnValue: t("Opslaan"),
    componentData: {
      group: {
        name: ""
      },
      closeModal: closeModal,
      //setGroups: setGroups,
      //saveGroups: saveGroups,
      //groups: groups,
      saveNewGroup
    }
  });

  const GroupList = () => {
    let groupss = [...groups]

    let searchForLowerCase = searchFor.toLowerCase()
    for (let i = 0; i < groupss.length; i++) {
      let name = groupss[i].title;
      if (!name.toLowerCase().includes(searchForLowerCase)) {
          groupss[i].hide = 'true'
      } else {
        groupss[i].hide = 'false'
      }
    }

    if(sort != ""){
      groupss.sort(SortObjectArray(sort, sortDirection));
    }

    return (
      <>
        <>
        {
          mainSuccessMessage.length > 0 ?
          <div className="alert alert-success" role="alert">{mainSuccessMessage}</div>
          : <></>
        }
        </>
        <>
        {
          mainErrorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert">{mainErrorMessage}</div>
          : <></>
        }
        </>
      {groupss.map((group, key) => {
        return (
          <div className="group" key={key}>
            <table>
              {key==0 ?
                <>
                  <thead>
                    <tr>
                      <th onClick={() => changeSort("id")}>
                        #
                      </th>
                      <th onClick={() => changeSort("title")}>
                        {t("Groep")}
                      </th>
                      <th>
                        {t("Status")}
                      </th>
                      <th>
                      </th>
                    </tr>
                  </thead>
                </>
                :<></>}
              <tbody>
                <tr className={(group.hide == 'true' ? ' hide':'')}>
                  <td onClick={() => {
                  showTab("chat", group);
                  }}>
                    {group.id}
                  </td>
                  <td onClick={() => {
                  showTab("chat", group);
                  }}>
                    {group.title}
                    {group.chatActive ?
                      <span className="activeChat">
                        {t("Actieve chat")}
                      </span>
                      :
                      <></>
                    }
                    {/*
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("Groep")}
                        aria-describedby={"items_" + key}
                        //value={JSON.parse(window.atob(lesson.settings)).title}
                        value=
                        onChange={e => updateGroupTitle(e.target.value, key)}
                        //onMouseDown={e => deActiveDragAndDrop(e)}
                      />
                    */}

                  </td>
                  <td onClick={() => {
                  showTab("settings", group);
                  }}>
                    {group.status == "closed" ? t("Gesloten"):''}
                    {group.status == "open" ? t("Open"):''}
                  </td>
                  {!detailsView ?
                    <td className="userActions">
                      <i className="far fa-comments"
                        data-tip={t("Start chat")}
                        onClick={() => {
                        showTab("chat", group);
                        }}>
                      </i>
                      <i className="fas fa-archive"
                        data-tip={t("Archief")}
                        onClick={() => {
                        showTab("archive", group);
                        }}>
                      </i>
                      <i className="fas fa-boxes"
                        data-tip={t("Log")}
                        onClick={() => {
                        showTab("log", group);
                        }}>
                      </i>
                      {
                        /*
                        <i className="fas fa-sms"
                          data-tip={t("Verstuur sms")}
                          onClick={() => {
                            showTab("sms", group);
                          }}>
                        </i>
                        */
                      }
                      <i className="fas fa-mail-bulk"
                        data-tip={t("Verstuur bericht")}
                        onClick={() => {
                          showTab("message", group);
                        }}>
                      </i>
                      <i className="fas fa-users"
                        data-tip={t("Deelnemers groep")}
                        onClick={() => {
                          showTab("students", group);
                        }}>
                      </i>
                      <i className="far fa-calendar-alt"
                        data-tip={t("Agenda")}
                        onClick={() => {
                          showTab("agenda", group);
                        }}>
                      </i>
                      <i className="fas fa-cog"
                        data-tip={t("Settings")}
                        onClick={() => {
                          showTab("settings", group);
                        }}>
                      </i>
                      <i className="fas fa-trash"
                        data-tip={t("Verwijder groep")}
                        onClick={() => {
                          deleteGroupConfirm(group.id)
                        }}
                      ></i>
                      <ReactTooltip place="top" effect="solid" delayShow={200} />
                    </td>
                    :<></>}
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
      </>
    )
  }

  return (
    <div className={"groups coachInterface students" + (openSearch ? ' openSearch':'')}>
      <div className="list listHidden">
        <table className="theIntervention">
          <tbody>
            <tr>
              <td>
                {detailsView ?
                  <>
                    <i className="fas fa-angle-left backToList" onClick={()=>toListView()}></i>

                    <h2><span>{t('Groep')}</span> {props.activeGroup.title}</h2>
                  </>
                  :
                  <>
                    <h2>{t('Groepen')}</h2>
                  </>
                }
                {searchFor != "" && !openSearch ?
                  <span className="btn btn-secondary filter" onClick={()=>setSearchFor("")}>
                    {searchFor} <i className="fas fa-times"></i>
                  </span>
                :''}
              </td>
              <td className="options">
                {!appSettings.included && !detailsView ?
                  <button className="btn btn-primary btn-sm btn-trans" onClick={addGroup}>
                    <i className="fas fa-plus"></i>
                  </button>
                :false}
                {!detailsView ?
                  <>
                    <i className={"fas fa-search pointer" + (openSearch ? ' hide':' ')} onClick={()=>searchView()}></i>
                    <div className="search">
                      <input type="text" value={searchFor} placeholder={t("Zoek groep")} onChange={(e) => setSearchFor(e.target.value)}/>
                      <i className="far fa-times-circle pointer" onClick={()=>setOpenSearch(false)}></i>
                    </div>
                  </>
                  :<></>}
              </td>
            </tr>
          </tbody>
        </table>
        <div className={"holder" + (detailsView ? ' detailsVisible':'')}>
          <div className="listContent">
            <div className="groups">
              <GroupList />
            </div>

          </div>
          {detailsView ? <>
            <div className="groupDetails">
              <Navbar showTab={showTab} activeTab={activeTab} type="groups" activeGroup={props.activeGroup}/>
              {/*activeTab == "sms" ? <SendSMS props.activeGroup={props.activeGroup}/>:<></>*/}
              {activeTab == "message" ? <SendMessage activeGroup={props.activeGroup}/>:<></>}
              {activeTab == "chat" ? <StartChat activeGroup={props.activeGroup}/>:<></>}
              {activeTab == "agenda" ? <Agenda activeGroup={props.activeGroup}/>:<></>}
              {activeTab == "settings" ? <Settings activeGroup={props.activeGroup} updateGroupTitle={updateGroupTitle} updateGroupStatus={updateGroupStatus} />:<></>}
              {activeTab == "log" ? <Log activeGroup={props.activeGroup}/>:<></>}
              {activeTab == "students" ? <Students activeGroup={props.activeGroup} interventions={[{intervention}]} noAdd={true}/>:<></>}
              {activeTab == "archive" ? <ChatArchive activeGroup={props.activeGroup}/>:<></>}
            </div>
            </>:<></>}
        </div>
      </div>

      <Modal {...modalData} />

      <ConfirmBox
        confirmOptions={confirmOptions}
        setConfirmOptions={setConfirmOptions}
      />

    </div>
  )
}

export default Groups;
