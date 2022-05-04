import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router";
import InterventionLinks from "../../interventionlinks";
import t from "../../translate";
import LeftMenu from "../leftmenu";

const Coach = props => {

  let history = useHistory();

  const auth = useSelector(state => state.auth);

  const [loading, setLoading] = useState(true);

  const onClickHandler = (event, intervention) => {
    if (typeof intervention.settings !== "undefined" && typeof intervention.settings.intervention_type !== "undefined" && intervention.settings.intervention_type === "chatcourse") {
      history.push("/dashboard/" + intervention.id);
    } else {
      history.push("/students/" + intervention.id);
    }
  }

  useEffect(() => {
    if (typeof props.interventions !== "undefined" && props.interventions.length > 0 && typeof auth.rights.interventions !== "undefined") {
      setLoading(false)
    }
  }, [props.interventions, auth.rights.interventions])

  if (!loading) {
    if (auth.rights.interventions.length < 1) {
      return (
        <div className="transWrapper">
          <div className="container dashboard_container">
            {t("Er zijn momenteel geen interventies aan uw account gekoppeld.")}
          </div>
        </div>
      );
    } else {
      if (auth.rights.interventions.length == 1 || props.interventions.length == 1) {
        let intervention = false;
        auth.rights.interventions.forEach(interv1 => {
          props.interventions.forEach(interv2 => {
            if (parseInt(interv1.id) === parseInt(interv2.id)) {
              intervention = interv2;
            }
          });
        });

        if (intervention.settings.intervention_type ===  'chatcourse') {
          return <Redirect to={"/dashboard/" + intervention.id} />;
        } else {
          return <Redirect to={"/students/" + intervention.id} />;
        }

      } else {
        return (
          <div className="transWrapper">
            <div className="container dashboard admin">
              <LeftMenu />
              <InterventionLinks
                refreshState="0"
                onClickHandler={onClickHandler}
                interventions={props.interventions}
              />
            </div>
          </div>
        );
      }
    }
  } else {
    return (
      <div className="transWrapper">
          <div className="container dashboard_container">
            {t("Loading...")}
          </div>
        </div>
    )
  }
}

export default Coach;
