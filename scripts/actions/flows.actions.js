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
export function selectColor(color, reloadLinks) {
  return _getSelectAction('color', color, actions.SELECT_COLOR, reloadLinks);
}
export function selectQual(qual, reloadLinks) {
  return _getSelectAction('qual', qual, actions.SELECT_QUAL, reloadLinks);
}
export function selectView(view, reloadLinks) {
  return _getSelectAction('view', view, actions.SELECT_VIEW, reloadLinks);
}

export function selectColumn(columnIndex, columnId) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_COLUMN,
      columnIndex,
      columnId
    });
    dispatch(loadLinks());
  };
}

export function selectVectorLayers(vectorLayers, reloadLinks) {
  return _getSelectAction('vectorLayers', vectorLayers, actions.SELECT_VECTOR_LAYERS, reloadLinks);
}

export function selectContextualLayers(contextualLayers, reloadLinks) {
  return _getSelectAction('contextualLayers', contextualLayers, actions.SELECT_CONTEXTUAL_LAYERS, reloadLinks);
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
    dispatch({
      type: actions.LOAD_INITIAL_DATA
    });

    const params = {
      country: getState().flows.selectedCountry,
      raw: getState().flows.selectedCommodity
    };
    const nodesURL = getURLFromParams('/v1/get_all_nodes', params);
    const columnsURL = getURLFromParams('/v1/get_columns', params);

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

    dispatch(loadMapVectorLayers());
  };
}

export function loadLinks() {
  return (dispatch, getState) => {
    dispatch({
      type: actions.LOAD_LINKS
    });

    const params = {
      country: getState().flows.selectedCountry.toUpperCase(),
      raw: getState().flows.selectedCommodity.toUpperCase(),
      year_start: getState().flows.selectedYears[0],
      include_columns: getState().flows.selectedColumnsIds.join(','),
      n_nodes: 10,
      flow_quant: getState().flows.selectedQuant,
      flow_qual: getState().flows.selectedQual,
      color: +getState().flows.selectedColor,
      view: +getState().flows.selectedView,
      years: getState().flows.selectedYears,
      layers: getState().flows.selectedLayers,
      vectorLayers: getState().flows.selectedVectorLayers,
      contextualLayers: getState().flows.selectedContextualLayers
    };
    console.log(params);
    const url = getURLFromParams('/v1/get_flows', params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {

        // load hi res map vector layers only after links have been loaded once?

        dispatch({
          type: actions.GET_LINKS,
          payload
        });
      });
  };
}

export function loadMapVectorLayers() {
  return (dispatch) => {
    _loadMapVectorLayers([
      'municip.topo.hi.json',
      'states.topo.json',
      'biomes.topo.json'
    ], dispatch);
  };
}

const _loadMapVectorLayers = (urls, dispatch) => {
  Promise.all(urls.map(url =>
      fetch(url).then(resp => resp.text())
  )).then(payload => {
    dispatch({
      type: actions.GET_GEO_DATA,
      payload
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
