import 'whatwg-fetch';
import actions from 'actions';
import { NUM_NODES } from 'constants';
import getURLFromParams from 'utils/getURLFromParams';

export function selectCountry(country, reloadLinks) {
  return _reloadLinks('country', country, actions.SELECT_COUNTRY, reloadLinks);
}
export function selectCommodity(commodity, reloadLinks) {
  return _reloadLinks('commodity', commodity, actions.SELECT_COMMODITY, reloadLinks);
}
export function selectQuant(quant, reloadLinks) {
  return _reloadLinks('quant', quant, actions.SELECT_QUANT, reloadLinks);
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

export function selectYears(years) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_YEARS,
      years
    });
    dispatch(loadNodes());
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

export function selectContextualLayers(contextualLayers) {
  return {
    type: actions.SELECT_CONTEXTUAL_LAYERS,
    contextualLayers
  };
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
    const allNodesURL = getURLFromParams('/v1/get_all_nodes', params);
    const columnsURL = getURLFromParams('/v1/get_columns', params);

    Promise.all([allNodesURL, columnsURL].map(url =>
        fetch(url).then(resp => resp.text())
    )).then(payload => {
      // TODO do not wait for end of all promises/use another .all call
      dispatch({
        type: actions.GET_COLUMNS,
        payload: payload.slice(0,2),
      });
      dispatch(loadNodes());
      dispatch(loadLinks());
    });
    dispatch(loadMapVectorLayers());
  };
}

export function loadNodes() {
  return (dispatch, getState) => {
    dispatch({
      type: actions.LOAD_NODES
    });
    const params = {
      country: getState().flows.selectedCountry.toUpperCase(),
      raw: getState().flows.selectedCommodity.toUpperCase(),
      year_start: getState().flows.selectedYears[0],
      year_end: getState().flows.selectedYears[1],
      column_id: 2
    };

    const url = getURLFromParams('/v1/get_nodes', params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {
        dispatch({
          type: actions.GET_NODES,
          payload
        });
      });
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
      view: +getState().flows.selectedView,
    };

    const selectedQual = getState().flows.selectedQual;
    if (selectedQual !== 'none') {
      params.flow_qual = selectedQual;
    }

    // if (getState().flows.selectedNodesIds.length) {
    //   params.clicked_nodes = getState().flows.selectedNodesIds.join(',');
    //   params.filter_mode = 2;
    // }

    const url = getURLFromParams('/v1/get_flows', params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {

        dispatch({
          type: actions.GET_LINKS,
          payload
        });
        dispatch({
          type: actions.RESELECT_NODES
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


export function selectNode(nodeId, isAggregated) {
  return dispatch => {
    if (isAggregated) {
      console.log('switch to detailed mode!');
    } else {
      dispatch({
        type: actions.SELECT_NODE,
        nodeId
      });
      dispatch({
        type: actions.FILTER_LINKS_BY_NODES
      });
    }
  };
}

export function selectNodeFromGeoId(geoId) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_NODE_FROM_GEOID,
      geoId
    });
    dispatch({
      type: actions.FILTER_LINKS_BY_NODES
    });
  };
}

export function highlightNode(nodeId, isAggregated) {
  return (dispatch, getState) => {
    if (isAggregated) return;

    // TODO move this to reducer
    if (getState().flows.selectedNodesIds.indexOf(nodeId) > -1) return;

    dispatch({
      type: actions.HIGHLIGHT_NODE,
      nodeId
    });
  };
}

export function highlightNodeFromGeoId(geoId) {
  return dispatch => {
    dispatch({
      type: actions.HIGHLIGHT_NODE_FROM_GEOID,
      geoId
    });
  };
}
