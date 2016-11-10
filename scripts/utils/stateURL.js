import _ from 'lodash';
import { URL_STATE_PROPS } from 'constants';

export const getURLParams = url => {
  let objParams = {};

  // removes '?' character from URL
  url = url.slice(1);

  // splits every param in the URL to a new array
  const splitedParams = url.split('&');

  // Loops params creating a new param object
  splitedParams.forEach((p) => {
    const param = p.split('=');

    if (param[0]) {
      objParams[param[0]] = param[1] || null;
    }

  });

  return objParams;
};

export const encodeStateToURL = state => {
  const urlProps = JSON.stringify(_.pick(state, URL_STATE_PROPS));
  const encoded = btoa(urlProps);
  window.history.pushState({}, 'Title', `?state=${encoded}`);
  return encoded;
};

export const decodeStateFromURL = urlHash => {
  return JSON.parse(atob(urlHash));
};
