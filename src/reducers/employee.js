import { EMP_LOGGED_IN, EMP_LOGGED_OUT, USER_ROLE } from "../types";

export default function employee(state = {}, action = {}) {
  switch (action.type) {
    case EMP_LOGGED_IN:
      return { ...state, token: action.emp };
    case EMP_LOGGED_OUT:
      return {};
    case USER_ROLE:
      return { ...state, role: action.role };
    default:
      return state;
  }
}
