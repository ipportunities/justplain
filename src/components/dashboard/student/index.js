import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Redirect } from "react-router-dom";
import InterventionLinks from "../../interventionlinks";
import { setActiveIntervention } from "../../../actions";
import t from "../../translate";

const Student = props => {

  let history = useHistory();
  const dispatch = useDispatch();

  const auth = useSelector(state => state.auth);
  
  const onClickHandler = (event, intervention) => {
    //history.push("/course/" + intervention.id);
  };
  
  if (auth.rights.interventions.length < 1) {
    return (
      <div className="transWrapper">
        <div className="container dashboard_container">
          {t("Er zijn momenteel geen cursussen aan uw account gekoppeld.")}
        </div>
      </div>
    );
  } else {
    if (auth.rights.interventions.length == 1) 
    { 
      //activeIntervention vastleggen in redux store
      dispatch(
        setActiveIntervention(
          auth.rights.interventions[0].id
        )
      );
      //// dan maar al de interventie settings ophalen?
      //return <Redirect to={"/course/" + auth.rights.interventions[0].id} />;
    } 
    else
    {
      return (
        <div className="transWrapper">
          <div className="container dashboard_container">
            <InterventionLinks
              refreshState="0"
              onClickHandler={onClickHandler}
            />
          </div>
        </div>
      );
    }
  }
};

export default Student;
