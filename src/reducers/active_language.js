const activeLanguageReducer = (
  state = 0, //dutch
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_LANGUAGE":
      return action.payload.language_id;
    default:
      return state;
  }
};

export default activeLanguageReducer;