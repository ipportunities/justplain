const activePageReducer = (
  state = 0,
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_PAGE":
      return action.payload.page_id;
    default:
      return state;
  }
};

export default activePageReducer;