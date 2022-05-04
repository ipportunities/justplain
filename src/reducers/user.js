const userReducer = (
  state = {
    id: 0,
    firstname: "",
    insertion: "",
    lastname: "",
    email: "",
    phone: "",
    organisation_id: 0,
    type: "",
    login: "",
    rights: {},
    password: ""
  },
  action
) => {
  switch (action.type) {
    case "USER_RESET":
      return {
        id: 0,
        firstname: "",
        insertion: "",
        lastname: "",
        email: "",
        phone: "",
        organisation_id: 0,
        type: "",
        login: "",
        rights: {},
        preferences: {},
        password: ""
      };
      break;
    case "USER_SET":
      return {
        id: action.payload.user.id,
        firstname: action.payload.user.firstname,
        insertion: action.payload.user.insertion,
        lastname: action.payload.user.lastname,
        email: action.payload.user.email,
        phone: action.payload.user.phone,
        organisation_id: action.payload.user.organisation_id,
        type: action.payload.user.type,
        login: action.payload.user.login,
        rights: action.payload.user.rights,
        preferences: action.payload.user.preferences,
        password: action.payload.user.password
      };
      break;
    default:
      return state;
  }
};

export default userReducer;
