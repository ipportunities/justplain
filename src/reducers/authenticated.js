const authenticatedReducer = (
  state = {
    status: null,
    user_id: 0,
    name: "",
    token: "",
    userType: "",
    rights: {},
    preferences: {},
    profile_pic:'',
    email:'',
    gender:'',
    education:'',
    date_time_birth:'',
    firstname:'',
    insertion:'',
    lastname:'',
  },
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return {
        status: true,
        user_id: action.payload.user_id,
        name: action.payload.name,
        token: action.payload.token,
        userType: action.payload.userType,
        rights: action.payload.rights,
        preferences: action.payload.preferences,
        profile_pic: action.payload.profile_pic,
        email:action.payload.email,
        gender:action.payload.gender,
        education:action.payload.education,
        date_time_birth:action.payload.date_time_birth,
        firstname:action.payload.firstname,
        insertion:action.payload.insertion,
        lastname:action.payload.lastname,
      };
    case "SET_AUTHENTICATED_FALSE":
      return {
        status: false,
        user_id: 0,
        name: "",
        token: "",
        userType: "",
        rights: {},
        preferences: {},
        profile_pic:'',
        email:'',
        gender:'',
        education:'',
        date_time_birth:'',
        firstname:'',
        insertion:'',
        lastname:'',
      };
    case "LOGOUT":
    case "SET_AUTHENTICATED_NULL":
      return {
        status: null,
        user_id: 0,
        name: "",
        token: "",
        userType: "",
        rights: {},
        preferences: {},
        profile_pic:'',
        email:'',
        gender:'',
        education:'',
        date_time_birth:'',
        firstname:'',
        insertion:'',
        lastname:'',
      };
    default:
      return state;
  }
};

export default authenticatedReducer;
