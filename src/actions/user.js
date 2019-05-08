import { EMP_LOGGED_IN, EMP_LOGGED_OUT } from "../types";
import API from "../helpers/api";

export const userLoggedIn = emp => ({
  type: EMP_LOGGED_IN,
  emp
});

export const userLoggedOut = () => ({
  type: EMP_LOGGED_OUT
});

export const login = credentials => async dispatch =>
  await API.post("/employees/login", credentials).then(emp => {
    if (emp.data.status) {
      localStorage.token = emp.data.data.token;
      dispatch(userLoggedIn(emp.data.data.token));
      return emp;
    }
    return emp;
  });

export const logout = () => dispatch => {
  localStorage.removeItem("token");
  dispatch(userLoggedOut());
};
