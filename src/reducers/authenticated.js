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
    phone:'',
    gender:'',
    education:'',
    date_time_birth:'',
    firstname:'',
    insertion:'',
    lastname:'',
    coachSupport: true,
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
        phone:action.payload.phone,
        gender:action.payload.gender,
        education:action.payload.education,
        date_time_birth:action.payload.date_time_birth,
        firstname:action.payload.firstname,
        insertion:action.payload.insertion,
        lastname:action.payload.lastname,
        coachSupport:action.payload.coachSupport,
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
        profile_pic: '',
        email: '',
        phone: '',
        gender: '',
        education: '',
        date_time_birth: '',
        firstname: '',
        insertion: '',
        lastname: '',
        coachSupport: true
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
        profile_pic: '',
        email: '',
        phone: '',
        gender: '',
        education: '',
        date_time_birth: '',
        firstname: '',
        insertion: '',
        lastname: '',
        coachSupport: true
      }
    default:
      return state;
  }
};

export default authenticatedReducer;
