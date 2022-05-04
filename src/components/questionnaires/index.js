import React, {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LeftMenu from "../dashboard/leftmenu";
import apiCall from "../api";
import { setIntervention } from "../../actions";
import { useLocation } from "react-router-dom";


const Questionnaires = props => {

  const dispatch = useDispatch();
  const history = useHistory();
  let location = useLocation();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);

  const [contentIndex, setContentIndex] = useState(0);

  const editQuestionnaire = (e, questionnaire_id) => {
    history.push("/questionnaire/edit/" + questionnaire_id);
  };

  useEffect(() => {
    let intervention_id = location.pathname.split("/")[2];
    if (intervention.id === 0 || intervention_id !== intervention.id) {
      apiCall({
        action: "get_intervention_settings",
        token: auth.token,
        data: {
          intervention_id,
          language_id: uiTranslation.language_id
        }
      }).then(resp => {
        dispatch(
          setIntervention(
            resp.intervention_id,
            resp.organisation_id,
            resp.title,
            resp.settings
          )
        );
      });
    }
  }, []);

  if (typeof intervention.settings.questionnaires == "undefined") {
    return <div></div>;
  } else {
    return (
      <div className="transWrapper">
        <LeftMenu />
        <div className="container dashboard_container">
          <div>
            {intervention.settings.questionnaires.map(questionnaire => {
              return (
                <div
                  className="pointer"
                  onClick={event => editQuestionnaire(event, questionnaire.id)}
                >
                  {questionnaire.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default Questionnaires;
