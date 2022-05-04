const activeSubHomeworkReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_SUBHOMEWORK":
      return action.payload.sub_homework_id;
    default:
      return state;
  }
};

export default activeSubHomeworkReducer;
