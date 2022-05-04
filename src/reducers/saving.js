const savingReducer = (
  state = 'saved',
  action
) => {
  switch (action.type) {
    case "SET_SAVING_STATUS":
      return action.payload.status;
    default:
      return state;
  }
};

export default savingReducer;
