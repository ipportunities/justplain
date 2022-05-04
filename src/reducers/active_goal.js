const activeGoalReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_GOAL":
      return action.payload.goal_id;
    default:
      return state;
  }
};

export default activeGoalReducer;