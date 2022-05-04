const uiTranslationReducer = (
  state = {
    language_id: 1, //dutch standard
    translation: []
  },
  action
) => {
  switch (action.type) {
    case "SET_UI_TRANSLATION":
      return {
        language_id: action.payload.language_id,
        translation: action.payload.translation
      };
    default:
      return state;
  }
};

export default uiTranslationReducer;
