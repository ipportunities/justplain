const activeHomeworkReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_HOMEWORK":
      return action.payload.homework_id;
    default:
      return state;
  }
};

export default activeHomeworkReducer;
