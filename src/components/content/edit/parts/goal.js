import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import t from "../../../translate";

const Goals = (props) => {

  const [chosenGoalId, setChosenGoalId] = useState(false);

  const intervention = useSelector(state => state.intervention);

  //////////////////////
  ///On init
  useEffect(() => {
    if(typeof props.part.goal_id != "undefined")
    {
      setChosenGoalId(props.part.goal_id)
    }
  }, []);

  function updateChosenGoal(goal_id){
    props.updatePart(props.index, 'goal_id', goal_id)
    setChosenGoalId(goal_id)
  }

  return(
    <div className="goals center">
      <select onChange={(e) => updateChosenGoal(e.target.value)} value={chosenGoalId}>
        <option>{t("Selecteer doel")}</option>
        {intervention.settings.goals.map((goal, index) =>
          <option key={index} value={goal.id}>Doel : {goal.title}</option>
        )}
      </select>
    </div>
  )
}
export default Goals
