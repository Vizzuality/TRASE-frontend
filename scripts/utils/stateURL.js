import _ from 'lodash';

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

const URL_STATE_PROPS = [
  'selectedContextId',
  'selectedYears',
  'detailedView',
  'selectedNodesIds',
  'expandedNodesIds',
  'areNodesExpanded',
  'selectedColumnsIds',
  'isMapVisible'
];

const filterStateToURL = state => {
  if (_.isEmpty(state)) {
    return {};
  }

  const stateToSave = _.pick(state, URL_STATE_PROPS);

  stateToSave.selectedResizeByName = state.selectedResizeBy ? state.selectedResizeBy.name : null;
  stateToSave.selectedRecolorByName = state.selectedRecolorBy ? state.selectedRecolorBy.name : null;
  stateToSave.selectedBiomeFilterName = state.selectedBiomeFilter ? state.selectedBiomeFilter.name : null;

  return stateToSave;
};

export const encodeStateToURL = state => {
  const urlProps = JSON.stringify(filterStateToURL(state));
  const encoded = btoa(urlProps);
  window.history.pushState({}, 'Title', `?state=${encoded}`);
  return encoded;
};

export const decodeStateFromURL = urlHash => {
  return JSON.parse(atob(urlHash));
};
