const pageHistoryReducer = (
  state = {
    intervention_id: 0,
    pageHistory: []
  },
  action
) => {
  switch (action.type) {
    case "SET_PAGE_HISTORY":
      return {
        intervention_id: action.payload.intervention_id,
        pageHistory: action.payload.pageHistory,
      };
    default:
      return state;
  }
};

export default pageHistoryReducer;