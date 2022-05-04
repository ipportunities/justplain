const activeLessonReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_LESSON":
      return action.payload.lesson_id;
    default:
      return state;
  }
};

export default activeLessonReducer;