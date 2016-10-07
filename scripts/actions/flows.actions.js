import actions from 'actions';
import { NUM_NODES } from 'constants';
import getURLFromParams from 'utils/getURLFromParams';

export function selectCountry(country, reloadLinks) {
  return _reloadLinks('country', country, actions.SELECT_COUNTRY, reloadLinks);
}
export function selectCommodity(commodity, reloadLinks) {
  return _reloadLinks('commodity', commodity, actions.SELECT_COMMODITY, reloadLinks);
}
export function selectYears(years, reloadLinks) {
  return _reloadLinks('years', years, actions.SELECT_YEARS, reloadLinks);
}
export function selectQuant(quant, reloadLinks) {
  return _reloadLinks('quant', quant, actions.SELECT_QUANT, reloadLinks);
}
export function selectColor(color, reloadLinks) {
  return _reloadLinks('color', color, actions.SELECT_COLOR, reloadLinks);
}
export function selectQual(qual, reloadLinks) {
  return _reloadLinks('qual', qual, actions.SELECT_QUAL, reloadLinks);
}
export function selectView(view, reloadLinks) {
  return _reloadLinks('view', view, actions.SELECT_VIEW, reloadLinks);
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

// we don't know at this moment waht to do with a vector layer.
// this isan example of the implementation
export function selectVectorLayers(layerData) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_VECTOR_LAYERS,
      layerData
    });
  };
}

export function selectContextualLayers(contextualLayers, reloadLinks) {
  return _reloadLinks('contextualLayers', contextualLayers, actions.SELECT_CONTEXTUAL_LAYERS, reloadLinks);
}

const _reloadLinks = (param, value, type, reloadLinks = true) => {
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
      year_end: getState().flows.selectedYears[1],
      include_columns: getState().flows.selectedColumnsIds.join(','),
      n_nodes: NUM_NODES,
      flow_quant: getState().flows.selectedQuant,
      flow_qual: getState().flows.selectedQual,
      color: +getState().flows.selectedColor,
      view: +getState().flows.selectedView,
      layers: getState().flows.selectedLayers,
      vectorLayers: getState().flows.selectedVectorLayers,
      contextualLayers: getState().flows.selectedContextualLayers
    };

    // if (getState().flows.selectedNodesIds.length) {
    //   params.clicked_nodes = getState().flows.selectedNodesIds.join(',');
    //   params.filter_mode = 2;
    // }

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


export function selectNode(nodeId) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_NODE,
      nodeId
    });
    // dispatch(loadLinks());
  };
}

export function highlightNode(nodeId) {
  return (dispatch, getState) => {
    if (getState().flows.selectedNodesIds.indexOf(nodeId) > -1) return;
    dispatch({
      type: actions.HIGHLIGHT_NODE,
      nodeId
    });
  };
}

export function selectNodeFromGeoId(geoId) {
  return {
    type: actions.SELECT_NODE_FROM_GEOID,
    geoId
  };
}
