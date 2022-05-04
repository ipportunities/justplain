import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import apiCall from "../api";
import { getClone } from "../utils";
import t from "../translate";
import { setIntervention } from "../../actions";
import SortObjectArray from "../helpers/sortObjectArray.js";
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useLocation } from "react-router-dom";
import {appSettings} from "../../custom/settings";

///TODO dit is nog wel wat omslachtig zo.....

const Students = (props) => {
  let location = useLocation();

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);

  const [users, setUsers] = useState([])

  const [activeGroupID, setActiveGroupID] = useState(false)

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {
    if(typeof props.activeGroup != "undefined"){
      setActiveGroupID(props.activeGroup.id)
      setUsers(props.activeGroup.students)
    }
  }, [props]);


  //functie die lijst opmaakt met users
  const ListItems = props => {
    let users = props.users
    /*
    let searchForLowerCase = searchFor.toLowerCase()
    for (let i = 0; i < users.length; i++) {
      let name = users[i].firstname + " " + users[i].insertion +  " " + users[i].lastname ;
      if (!name.toLowerCase().includes(searchForLowerCase)) {
          users[i].hide = 'true'
      } else {
        users[i].hide = 'false'
      }
    }
    */

    if(sort !== "") {
      users.sort(SortObjectArray(sort, sortDirection));
    }

    return (
      <table>
        <tbody>
          <tr>
            <th className="pointer" onClick={() => changeSort("id")}>#</th>
            <th className="pointer" onClick={() => changeSort("firstname")}>{t("Naam")}</th>
            <th></th>
          </tr>
          {users.map((user, index) => {
              return (
                <React.Fragment key={index}>
                <tr
                  key={user.id}
                  id={"user_" + user.id}
                  className={"pointer rowHover" + (user.hide == 'true' ? ' hide':'')}
                >
                  <td onClick={() => props.showStudentDetails(user)}>{user.id}</td>
                  <td onClick={() => props.showStudentDetails(user)}>
                      {
                        (user.anonymous === 1) ?
                          <>{user.login}</>
                          :
                          <>
                            {user.firstname} {user.insertion} {user.lastname}
                          </>
                      }
                      &nbsp; <span className={(user.unread_message) ? 'badge badge-success' : 'hidden'}><i className="far fa-comments"></i></span>
                      &nbsp; <span className={(user.unseen_lesson) ? 'badge badge-warning' : 'hidden'}><i className="fas fa-atlas"></i></span>
                      &nbsp; <span className={(user.call_t1) ? 'badge badge-info' : 'hidden'} data-tip={user.phone}><i className="fas fa-phone-square-alt"></i> t1</span>
                      &nbsp; <span className={(user.call_t2) ? 'badge badge-info' : 'hidden'} data-tip={user.phone}><i className="fas fa-phone-square-alt"></i> t2</span>
                  </td>

                  <td className='userActions'>
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
                        className="far fa-comments"
                        onClick={() => props.showStudentDetails(user, 'chat')}
                        data-tip={t("Chat")}
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
                </React.Fragment>
                  );
          })}
        </tbody>
      </table>
    );
  };


  //// ideetje tbv visueel hulpmiddeltje dat je kan zien dat je kan scrollen
  //const [scrollIconList, setScrollIconList] = useState(false)

  const [sort, setSort] = useState("")
  const [sortDirection, setSortDirection] = useState("")

  function changeSort(type){
    setSortDirection(sortDirection == "asc" ? "desc":"asc")
    setSort(type)
  }

  const showStudentDetails = (user, tab = false) => {
    history.push("/dashboard/" + intervention.id + "/students/" + user.id + "/" + tab)
  }

  return (
    <div className={"coachInterface students"}>

      <div className={'list list' + (false ? 'Visible':'Hidden') }>
        <table className="theIntervention">
          <tbody>
            <tr>
              <td>
                <h4>{t('Deelnemers')}</h4>
              </td>
              <td className="options">

              </td>
            </tr>
          </tbody>
        </table>
        <table className='holder'>
          <tbody>
            <tr>
              <td className="left">
                {users.length == 0 ?
                  <>
                    <br/>
                    {t("Er zijn geen studenten gekoppeld aan deze groep")}
                  </>
                  :
                  <div className="users">
                    <ListItems
                    users={users}
                    showStudentDetails={showStudentDetails}/>
                  </div>
                }
              </td>

            </tr>
          </tbody>
        </table>

    </div>
    </div>
  );
};

export default Students;
