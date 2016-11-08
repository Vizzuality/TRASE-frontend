function getUrlParams (url){
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
}

function encodeState(state) {
  return btoa(JSON.stringify(state));
}

function decodeState(urlHash) {
  return JSON.parse(atob(urlHash));
}

export { getUrlParams, encodeState, decodeState };
