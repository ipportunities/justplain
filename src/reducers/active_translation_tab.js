const activeTranslationTabReducer = (
  state = 'title',
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE_TRANSLATION_TAB":
      return action.payload.translation_tab;
    default:
      return state;
  }
};

export default activeTranslationTabReducer;