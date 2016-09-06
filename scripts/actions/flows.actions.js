import actions from 'actions';
import prepareData from 'utils/sankey.prepareData';
import getURLFromParams from 'utils/sankey.getURLFromParams';


// params sent to the API
// FIXME will be dynamic at some point
const params = {
  country: 'brazil',
  raw: 'soy',
  year: '2012',
  nNodes: '10000000',
  excludeLayers: [0,2,4,6,7,8,9],
  // excludeNodes: [2575,2576,2577,2578],
  flowQuant: 'Volume',
  flowQual: 'Commodity',
  // includeNodeQuals: ['Mun Id IBGE'],
  // clickedNodes: [39]
};

export function selectIndicator(indicator) {
  return {
    type: actions.SELECT_INDICATOR,
    indicator
  };
}

export function loadData() {
  return (dispatch) => {
    // FIXME currently the API only runs locally, production version uses a CLI-pregenerated JSON file
    const url = (NODE_ENV_DEV) ?  getURLFromParams(params) : 'sample.json';
    fetch(url)
      .then(res => res.text())
      .then(payload => {
        dispatch({
          type: actions.GET_DATA,
          payload: prepareData(JSON.parse(payload))
        });
      });
  };
}

export function selectNode() {
  return {
    type: actions.SELECT_NODE
  };
}

export function highlightNode(id) {
  return (dispatch, getState) => {
    if (id === getState().flows.selectedNodeId) return;
    dispatch({
      type: actions.HIGHLIGHT_NODE,
      id
    });
  };
}
