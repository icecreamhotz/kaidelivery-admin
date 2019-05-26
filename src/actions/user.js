import { EMP_LOGGED_IN, EMP_LOGGED_OUT, USER_ROLE } from "../types";
import API from "../helpers/api";
import jwt_decode from "jwt-decode";

export const userLoggedIn = emp => ({
  type: EMP_LOGGED_IN,
  emp
});

export const userLoggedOut = () => ({
  type: EMP_LOGGED_OUT
});

export const userRole = role => ({
  type: USER_ROLE,
  role
});

export const login = credentials => async dispatch =>
  await API.post("/employees/login", credentials).then(emp => {
    if (emp.data.status) {
      const decoded = jwt_decode(emp.data.data.token);
      localStorage.token = emp.data.data.token;
      dispatch(userLoggedIn(emp.data.data.token));
      dispatch(userRole(decoded.emptype_id));
      return emp;
    }
    return emp;
  });

export const logout = () => dispatch => {
  localStorage.removeItem("token");
  dispatch(userLoggedOut());
};
