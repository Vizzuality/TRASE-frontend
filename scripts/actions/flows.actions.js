import actions from 'actions';
import getURLFromParams from 'utils/getURLFromParams';

export function selectCountry(country, reloadLinks) {
  return _getSelectAction('country', country, actions.SELECT_COUNTRY, reloadLinks);
}
export function selectCommodity(commodity, reloadLinks) {
  return _getSelectAction('commodity', commodity, actions.SELECT_COMMODITY, reloadLinks);
}
export function selectYears(years, reloadLinks) {
  return _getSelectAction('years', years, actions.SELECT_YEARS, reloadLinks);
}
export function selectQuant(quant, reloadLinks) {
  return _getSelectAction('quant', quant, actions.SELECT_QUANT, reloadLinks);
}
export function selectQual(qual, reloadLinks) {
  return _getSelectAction('qual', qual, actions.SELECT_QUAL, reloadLinks);
}

const _getSelectAction = (param, value, type, reloadLinks = true) => {
  // console.log(param, value, type, reloadLinks)
  return dispatch => {
    const action = {
      type
    };
    action[param] = value;
    dispatch(action);
    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
};

export function loadInitialData() {
  return (dispatch, getState) => {
    const params = {
      method: 'get_all_nodes',
      country: getState().flows.selectedCountry,
      raw: getState().flows.selectedCommodity
    };
    const nodesURL = getURLFromParams(params);
    params.method = 'get_columns';
    const columnsURL = getURLFromParams(params);

    Promise.all([nodesURL, columnsURL].map(url =>
        fetch(url).then(resp => resp.text())
    )).then(payload => {
      // TODO do not wait for end of all promises/use another .all call
      dispatch({
        type: actions.GET_COLUMNS,
        payload: payload.slice(0,2),
      });
      dispatch(loadLinks());
    });

    dispatch(loadLowResMapVectorLayers());
  };
}

export function loadLinks() {
  return (dispatch, getState) => {
    const columnIndexes = [0,3,4,8];
    const params = {
      method: 'get_flows',
      country: getState().flows.selectedCountry.toUpperCase(),
      raw: getState().flows.selectedCommodity.toUpperCase(),
      yearStart: getState().flows.selectedYears[0],
      includeColumns: columnIndexes,
      nNodes: 10,
      flowQuant: getState().flows.selectedQuant,
      flowQual: getState().flows.selectedQual
    };
    const url = getURLFromParams(params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {

        // load hi res map vector layers only after links have been loaded once
        if (!getState().flows.linksPayload) {
          dispatch(loadHiResMapVectorLayers());
        }

        dispatch({
          type: actions.GET_LINKS,
          payload,
          columnIndexes
        });
      });
  };
}

export function loadLowResMapVectorLayers() {
  return (dispatch) => {
    const municipURL = 'municip.topo.low.json';
    _loadMapVectorLayers([municipURL], dispatch);
  };
}

export function loadHiResMapVectorLayers() {
  return (dispatch) => {
    const municipURL = 'municip.topo.json';
    _loadMapVectorLayers([municipURL], dispatch);
  };
}

const _loadMapVectorLayers = (urls, dispatch) => {
  Promise.all(urls.map(url =>
      fetch(url).then(resp => resp.text())
  )).then(payload => {
    dispatch({
      type: actions.GET_GEO_DATA,
      payload: payload[0]
    });
  });
};


export function selectNode(id) {
  return {
    type: actions.SELECT_NODE,
    id
  };
}

export function highlightNode(id) {
  return (dispatch, getState) => {
    if (getState().flows.selectedNodesIds.indexOf(id) > -1) return;
    dispatch({
      type: actions.HIGHLIGHT_NODE,
      id
    });
  };
}

export function selectNodeFromGeoId(geoId) {
  return {
    type: actions.SELECT_NODE_FROM_GEOID,
    geoId
  };
}
