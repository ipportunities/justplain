import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIntervention } from "../../../actions";
import { useHistory, useParams } from "react-router-dom";
import apiCall from "../../api";
import t from "../../translate";
import LeftMenu from "../leftmenu";
import AgendaChatcourse from "../../agenda/chatcourse";
import Texts from "../../texts";
import Groups from "../../groups";
import GroupsArchive from "../../groups/archive";
import Registrations from "../../registrations";
import Registration from "../../registrations/single";
import Students from "../../students";
import DashboardCoachNavbar from "./navbar";
import { useLocation } from "react-router-dom";
import $ from "jquery";

const CourseDashboard = props => {

  let location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { interventionId } = useParams()

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);

  const [interventions, setInterventions] = useState([])
  const [registrationID, setRegistrationID] = useState(0)

  const settingsType = location.pathname.split('/')[3]
  const [activeTab, setActiveTab] = useState('')

  ////Ten behoeve van het klikken in het hoofdmenu opdat detail views gereset kunnen worden
  ///TODO nog een keer nagaan of dit gegroeide wel zo logisch is...
  const [studentId, setStudentId] = useState(0)
  const [studentTab, setStudentTab] = useState('')
  const [activeGroup, setActiveGroup] = useState('')

  if (settingsType !== activeTab && typeof settingsType != 'undefined' && settingsType !== '' && !Number.isInteger(parseInt(settingsType))) {
    setActiveTab(settingsType)
  }

  const showTab = tab => {
    setActiveTab('');
    if(tab == 'groups' || tab == 'group-archive'){
      setActiveGroup('');
    }
    //setActiveTab(tab);
  };

  useEffect(() => {
    //api aanroepen om settings op te halen
    getInterventionSettings(interventionId)
  }, [auth]);

  useEffect(() => {
    setActiveTab('');
    if(location.pathname.split("/")[3] != activeTab) {

      if (typeof location.pathname.split("/")[3] !== "undefined") {
        setActiveTab(location.pathname.split("/")[3]);
      } else {
        setActiveTab('registrations')
      }
    }
    if (location.pathname.split("/")[3] === 'registrations') {
      if (typeof location.pathname.split("/")[4] !== 'undefined' && Number.isInteger(parseInt(location.pathname.split("/")[4])) && parseInt(location.pathname.split("/")[4]) > 0) {
        setRegistrationID(parseInt(location.pathname.split("/")[4]))
      } else {
        setRegistrationID(0)
      }
    }
    if(location.pathname.split("/")[3] == "students" && location.pathname.split("/").length >= 5){
      setStudentId(location.pathname.split("/")[4])
      if(location.pathname.split("/").length > 5){
        setStudentTab(location.pathname.split("/")[5])
      }
    } else {
      setStudentId(0)
    }
  }, [location]);

  let scrollbarRef = useRef()

  const handleScroll = (event) => {
    let scrollTop = $(document).scrollTop();
    if(scrollTop > 180){
      $(".coachInterface").addClass("navScrolledTop")
    } else {
      $(".coachInterface").removeClass("navScrolledTop")
    }
  }

  //onFirstRenderOnly to prevent infinite render loop
  useEffect(() => {

    if(props.interventions != ""){
      setInterventions(props.interventions)
    }

    window.addEventListener('scroll', handleScroll);

  }, [props]);

  function changeIntervention(int_id){

    let this_intervention_obj = interventions.filter(function (intervention) {
      return intervention.id === int_id
    });
    if(this_intervention_obj.length != 0){

      history.push("/dashboard/" + int_id)
      getInterventionSettings(int_id)
    }

  }

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
    });

  }

  return (
    <div className="coachInterface coachInterface_v2">
      <table className="navbar navbar-coachInterface_v2 navbar-expand-lg navbar-light bg-light">
        <tbody>
          <tr>
            <td>
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
            </td>
            <td>
            <DashboardCoachNavbar showTab={showTab}/>
            </td>
          </tr>
        </tbody>
      </table>
      <LeftMenu />
      <div className="content">
        {activeTab == "students" ? <Students interventions={interventions} hasMenu={true} studentId={studentId} studentTab={studentTab} setStudentId={setStudentId} />:<></>}
        {activeTab == "agenda" ? <AgendaChatcourse />:<></>}
        {activeTab == "texts" ? <Texts />:<></>}
        {activeTab == "groups" ? <Groups activeGroup={activeGroup} setActiveGroup={setActiveGroup}/>:<></>}
        {activeTab == "group-archive" ? <GroupsArchive activeGroup={activeGroup} setActiveGroup={setActiveGroup}/>:<></>}
        {
          activeTab == "registrations" && registrationID !== 0 ? <Registration registration_id={registrationID} /> :
            activeTab == "registrations" ? <Registrations /> : <div>{activeTab} {registrationID}</div>
        }
      </div>
    </div>
  )
}
export default CourseDashboard
