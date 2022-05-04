const previousLessonsReducer = (
  state = [],
  action
) => {
  switch (action.type) {
    case "SET_PREVIOUS_LESSONS":
      return action.payload.previous_lessons;
    default:
      return state;
  }
};

export default previousLessonsReducer;