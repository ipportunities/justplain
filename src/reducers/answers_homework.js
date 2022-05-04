const answersHomeworkReducer = (
  state = {
    intervention_id: 0,
    answers: []
  },
  action
) => {
  switch (action.type) {
    case "SET_ANSWERS_HOMEWORK":
      return {
        intervention_id: action.payload.intervention_id,
        answers: action.payload.answers,
      };
    default:
      return state;
  }
};

export default answersHomeworkReducer;
