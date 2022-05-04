import React, {useEffect, useState} from "react"
import t from "../../translate"
import { useSelector, useDispatch } from "react-redux"
import apiCall from "../../api"
import { setSavingStatus } from "../../../actions"
import { getClone } from "../../utils";

const  Group = props => {

  const dispatch = useDispatch()

  const intervention = useSelector(state => state.intervention)
  const auth = useSelector(state => state.auth)

  const [groups, setGroups] = useState([])
  const [activeGroup, setActiveGroup] = useState(0)

  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    console.log(props);
    if(props.user.id > 0) {
      let thisIntervention = props.user.rights.interventions.filter(function (int) {
        return int.id === intervention.id
      })
      let thisInterventionIndex = props.user.rights.interventions.indexOf(thisIntervention[0])
      if(thisInterventionIndex >= 0) {
        if(typeof props.user.rights.interventions[thisInterventionIndex] !== "undefined"){
          setActiveGroup(props.user.rights.interventions[thisInterventionIndex].group_id)
        }
      }
    }
  }, [props])

  useEffect(() => {
    if(intervention.id > 0) {
      apiCall({
        action: "get_groups_and_archived_groups_coach",
        token: auth.token,
        data: {
          intervention_id: intervention.id,
        }
      }).then(resp => {
        setGroups(resp.groups)
      });
    }
  }, [intervention.id])


  const saveChangeGroup = (e) => {

    dispatch(setSavingStatus("not_saved"));

    apiCall({
      action: "user_change_group",
      token: auth.token,
      data: {
        user_id: props.user.id,
        intervention_id: intervention.id,
        group_id: activeGroup
      }
    }).then(resp => {
      if (resp.msg === 'ok') {
        dispatch(setSavingStatus("saved"))
      } else {
        setErrorMessage(resp.msg);
      }
    })

    /* let thisIntervention = props.user.rights.interventions.filter(function (int) {
      return int.id === intervention.id
    });
    let thisInterventionIndex = props.user.rights.interventions.indexOf(thisIntervention[0])

    if(thisInterventionIndex >= 0){
      props.user.rights.interventions[thisInterventionIndex].group_id = activeGroup;

      let thisUser = props.state.users.filter(function (user) {
        return user.id === props.user.id
      });
      let thisUserIndex = props.state.users.indexOf(thisUser[0])

      if(thisUserIndex >= 0){
        const newState = getClone(props.state);
        newState.users[thisUserIndex].rights = props.user.rights;
        console.log(props.state.users[thisUserIndex]);
        props.setState(newState)
      }

      /// zonder deze doet die het niet....
      props.user.password = '';
      props.user.password_check = '';
      setTimeout(function(){
        apiCall({
          action: "user_change_group",
          token: auth.token,
          data: {
            user_id: props.user.id
          }
        }).then(resp => {
          dispatch(setSavingStatus("saved"));
        });
      }, 250)
    } */
  }

  console.log(groups);

  const groupStatus = (status) => {
    if(status == "closed"){
      return t("gesloten");
    }
    if(status == "open"){
      return t("open");
    }
    if(status == "archive"){
      return t("gearchiveerd");
    }
  }

  return(
    <div className="group">
      <h4>{t("Groep")}</h4>
      <>
      {
        errorMessage.length > 0 ?
          <div className="alert alert-danger" role="alert">{errorMessage}</div>
          : <></>
      }
      </>
      <select onChange={(e)=>setActiveGroup(e.target.value)} value={activeGroup}>
        {/*<option value="">{t("Selecteer groep")}</option>*/}
        {groups.map((group, key) => {
          return (
            <option key={key} value={group.id}>{group.title} ({groupStatus(group.status)})</option>
          )
        })}
      </select>
      &nbsp;
      <span className="btn btn-primary" onClick={saveChangeGroup}>
        {t("Opslaan")}
      </span>
    </div>
  )
}

export default Group;
