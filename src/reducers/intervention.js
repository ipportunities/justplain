const interventionReducer = (
  state = {
    id: 0,
    organisation_id: 0,
    title: "",
    settings: {
      intervention_type: "selfhelp",
      selfhelp: {
        optionalLessons: [],
        lessons: [],
        lesson_new_title: "",
        guided_selfhelp_view_lessons: 0,
        guided_selfhelp_view_questionnaires: 0,
        guided_selfhelp_view_goals: 0,
        guided_selfhelp_view_log: 0,
        guided_selfhelp_chat_contact: 0,
      },
      apply: "oninvite",
      apply_reminders: true,
      exclusion_questions: false,
      baseline_measurement: false,
      research: false,
      questionnaires: [],
      goals: [],
      pages: [],
      questionnaire_new_title: "",
      include_stress_meter: 0
    }
  },
  action
) => {
  switch (action.type) {
    case "SET_INTERVENTION":
      return {
        id: action.payload.intervention_id,
        organisation_id: action.payload.organisation_id,
        title: action.payload.title,
        settings: action.payload.settings
      };
    default:
      return state;
  }
};

export default interventionReducer;
