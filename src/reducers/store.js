import { createStore } from "redux";
import allReducers from "./";

const store = createStore(
  allReducers /* preloadedState, */,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;