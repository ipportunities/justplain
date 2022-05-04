const activeSubLessonReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_SUBLESSON":
      return action.payload.sub_lesson_id;
    default:
      return state;
  }
};

export default activeSubLessonReducer;