const gamificationReducer = (
  state = {
    points:{
      interventions:[],
    },
    badges:{
      interventions:[],
    },
    login:false,
  },
  action
) => {
  switch (action.type) {
    case "SET_GAMIFICTION":
      return action.payload.gamification;
    default:
      return state;
  }
};

export default gamificationReducer;
