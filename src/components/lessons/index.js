import React, {useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import LeftMenu from "../leftmenu";
import apiCall from "../api";
import { useLocation } from "react-router-dom";
import { setIntervention } from "../../actions";

const Lessons = props => {
  let location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const intervention = useSelector(state => state.intervention);
  const uiTranslation = useSelector(state => state.uiTranslation);

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

  const editLesson = (e, lesson_id) => {
    history.push("/lesson/edit/" + lesson_id);
  };

  if (
    typeof intervention.settings.selfhelp == "undefined" ||
    !intervention.settings.selfhelp.hasOwnProperty("lessons")
  ) {
    return <div></div>;
  } else {
    return (
      <div className="transWrapper">
        <LeftMenu />
        <div className="container dashboard_container">
          <div>
            {intervention.settings.selfhelp.lessons.map(lesson => {
              return (
                <div
                  className="pointer"
                  onClick={event => editLesson(event, lesson.id)}
                >
                  {lesson.title}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default Lessons;
