const activeInterventionReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_INTERVENTION":
      return action.payload.intervention_id;
    default:
      return state;
  }
};

export default activeInterventionReducer;