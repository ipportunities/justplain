import React, {useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import t from "../../translate";
import parse from 'html-react-parser';
import apiCall from "../../api";
import CustomRight from "./goal/custom/right/24.js";
import GetCards from "./goal/getCards.js";
import { setActivePart } from "../../../actions";

const Goal = () => {

  const dispatch = useDispatch();
  const history = useHistory();

  const auth = useSelector(state => state.auth);
  const activeGoal = useSelector(state=> state.activeGoal);
  const intervention = useSelector(state=> state.intervention);

  const [logGoal, setLogGoal] = useState(false);
  const [goal, setGoal] = useState({
    title: '',
    id: '',
  });
  const [answers, setAnswers] = useState([]);

  useEffect(() => {

    if (activeGoal > 0)
    {
      let newGoal = intervention.settings.goals.filter(function (goal) {
        return goal.id === activeGoal
      });
      let logOff = false;
      if (typeof newGoal !== 'undefined' && newGoal.length > 0)
      {
        //deze tussenpagina overslaan en direct naar editgoal???
        if (newGoal[0].settings.skipFirstPage !== undefined && newGoal[0].settings.skipFirstPage === true)
        {
          editGoal(activeGoal, 0);
        }

        setGoal(newGoal[0])

        let newLogGoal = intervention.settings.goals.filter(function (goal) {
          return goal.settings.logOff === newGoal[0].id
        });

        if(newLogGoal.length > 0){
          setLogGoal(newLogGoal[0])
          logOff = newLogGoal[0].id
        }
      }

      apiCall({
        action: "get_all_answers_goal", // hier ook die van het log item toevoegen
        token: auth.token,
        data: {
          goal_id: parseInt(activeGoal),
          logOff:logOff
        }
      }).then(resp => {
        if (resp.answers)
        {
          /// volgorde is nu op basis van id oplopen tijd misschien beter
          /// sorteren op basis van gezette tijd.....
          setAnswers(resp.answers);
        }
      });

    }
  }, [intervention, activeGoal]);

  const editGoal = (goal_id, id) => {
    dispatch(setActivePart("goal-edit"));
    history.push("/course/" + intervention.id + "/goal-edit/" + goal_id + "/" + id);
  }

  return(
    <div className='goal' id={"goal_" + activeGoal}>
      <div className={"doIt" + (logGoal != false ? ' hasLogOption':'')}>
        <h1>
          {parse(goal.title)}
        </h1>
        <span className="btn btn-primary" onClick={e=>editGoal(activeGoal, 0)}>{t("Doe oefening")}</span>
        {logGoal != false ? <span className="btn" onClick={e=>editGoal(logGoal.id, 0)}>{t("Of log een oefening")}</span>:''}
      </div>

      {answers.length > 0 ?
        <div className="clearfix">
          {activeGoal == 24 ?
            <CustomRight/>
            :''}
          <div className="items">
            <h2>{t("Je gelogde oefeningen")}</h2>
            <GetCards intervention_id={intervention.id} activeGoal={activeGoal} answers={answers}/>

          </div>
        </div>
        :''
      }
    </div>
  )
}

export default Goal
