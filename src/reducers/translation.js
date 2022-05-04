const translationReducer = (
  state = {},
  action
) => {
  switch (action.type) {
    case "SET_TRANSLATION":
      return action.payload.translation;
    default:
      return state;
  }
};

export default translationReducer;
