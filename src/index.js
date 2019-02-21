import React from "react";
import ReactDOM from "react-dom";

import { Route, HashRouter } from "react-router-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import "antd/dist/antd.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import rootReducer from "./rootReducer";
// import { userLoggedIn } from './actions/auth';

// import { addLocaleData } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import th from 'react-intk/locale-data/th';
// import { localeSet } from './actions/locale';

// addLocaleData(en);
// addLocaleData(th);

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

// if(localStorage.token) {
//     const user = { token: localStorage.token }
//     store.dispatch(userLoggedIn(user))
// }

// if(localStorage.lang) {
//     store.dispatch(localeSet(localStorage.lang))
// }

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
