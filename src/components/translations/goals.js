import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import t from "../translate";
import Goal from "./goal";

const TranslateGoals = () => {

  const intervention = useSelector(state => state.intervention);

  const [activeGoalId, setActiveGoalId] = useState(0);
  useEffect(() => {
    if(intervention.settings.goals[0]){
      setActiveGoalId(intervention.settings.goals[0].id);
    }

  }, [intervention.settings.goals[0]])

  const selectGoal = (e) => {
    setActiveGoalId(e.target.value);
  }

  return (
    <div>
      <select className="custom-select" onChange={(e) => selectGoal(e)}>
      {
        intervention.settings.goals.map((goal, index) => {
          return (
            <option key={index} value={goal.id}>
              {
                parseInt(goal.parent_id) === 0 ? '' : ' - - - - - - '
              }
              {goal.title}
            </option>
          )
        })
      }
      </select>
      <br /><br />
      <Goal activeGoalId={activeGoalId} />

    </div>
  )

}

export default TranslateGoals;
