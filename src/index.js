import React from "react";
import ReactDOM from "react-dom";

import { Route, HashRouter } from "react-router-dom";

import jwt_decode from "jwt-decode";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { userLoggedIn, userRole } from "./actions/user.js";

import { localeSet } from "./actions/locale";

import rootReducer from "./rootReducer";

import { addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import th from "react-intl/locale-data/th";

addLocaleData(en);
addLocaleData(th);

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

if (localStorage.token) {
  const employee = { token: localStorage.token };
  const decoded = jwt_decode(localStorage.token);
  store.dispatch(userLoggedIn(employee));
  store.dispatch(userRole(decoded.emptype_id));
}

if (localStorage.lang) {
  store.dispatch(localeSet(localStorage.lang));
}

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Route component={App} />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
