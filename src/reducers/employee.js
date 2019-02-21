import { EMP_LOGGED_IN, EMP_LOGGED_OUT } from "../types";

export default function employee(state = {}, action = {}) {
  switch (action.type) {
    case EMP_LOGGED_IN:
      return { token: action.emp };
    case EMP_LOGGED_OUT:
      return {};
    default:
      return state;
  }
}
