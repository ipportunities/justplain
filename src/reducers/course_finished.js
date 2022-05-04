const finishedCourseReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "SET_COURSE_FINISHED":
      return action.payload.finished;
    default:
      return state;
  }
};

export default finishedCourseReducer;
