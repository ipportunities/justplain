const activePartReducer = (
  state = '',
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_PART":
      return action.payload.part;
    default:
      return state;
  }
};

export default activePartReducer;
