import { combineReducers } from "redux";

import employee from "./reducers/employee";
import locale from "./reducers/locale";

export default combineReducers({
  employee,
  locale
});
