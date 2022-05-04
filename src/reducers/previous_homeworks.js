const previousHomeworksReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "SET_PREVIOUS_HOMEWORKS":
      return action.payload.previous_homeworks;
    default:
      return state;
  }
};

export default previousHomeworksReducer;
