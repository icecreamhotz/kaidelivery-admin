import { CHANGE_LOCALE } from "../types";

export default function locale(state = { lang: "th" }, action = {}) {
  switch (action.type) {
    case CHANGE_LOCALE:
      return { lang: action.lang };
    default:
      return state;
  }
}
