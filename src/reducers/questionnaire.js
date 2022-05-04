const questionnaireReducer = (
  state = {
    id: 0,
    lessons: 0
  },
  action
) => {
  switch (action.type) {
    case "SET_QUESTIONNAIRE":
      return {
        id: action.payload.questionnaire_id,
        lessons: action.payload.lessons,
      };
    default:
      return state;
  }
};

export default questionnaireReducer;
