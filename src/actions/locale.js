import { CHANGE_LOCALE } from "../types";

export const setLocale = lang => ({
  type: CHANGE_LOCALE,
  lang
});

export const localeSet = lang => dispatch => {
  localStorage.lang = lang;
  dispatch(setLocale(lang));
};
