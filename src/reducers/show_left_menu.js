const showLeftMenuReducer = (
  state = false,
  action
) => {
  switch (action.type) {
    case "SET_SHOW_LEFT_MENU":
      return action.payload.show;
    default:
      return state;
  }
};

export default showLeftMenuReducer;
