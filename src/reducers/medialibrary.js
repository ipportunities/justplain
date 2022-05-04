const mediaLibraryReducer = (
  state = {
    chosen_image: '',
    index: '',
  },
  action
) => {
  switch (action.type) {
    case "SET_CHOSEN_IMAGE":
      return {
        chosen_image: action.payload.chosen_image,
        index: action.payload.index,
      };
    default:
      return state;
  }
};

export default mediaLibraryReducer;
