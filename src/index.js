import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./reducers/store";
//libraries

import "./libraries/bootstrap-4.3.1/dist/css/bootstrap.css";
import "./libraries/bootstrap-4.3.1/dist/css/bootstrap-override.css";
import "popper.js/dist/popper"; //als package geinstalleerd
import "bootstrap/dist/js/bootstrap"; //als package geinstalleerd
import "./libraries/fontawesome-free-5.13.0-web/css/all.css";
//import './libraries/fontawesome-free-5.11.2-web/js/all.js';
import "jquery"; //als package geinstalleerd

//const store = createStore(
//  allReducers /* preloadedState, */,
//  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </Provider>,

  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
