import 'whatwg-fetch';
import actions from 'actions';
import { NUM_NODES_SUMMARY, NUM_NODES_DETAILED, CARTO_NAMED_MAPS_BASE_URL } from 'constants';
import getURLFromParams from 'utils/getURLFromParams';
import mapContextualLayers from './map/context_layers';


export function resetState() {
  return (dispatch) => {
    dispatch({
      type: actions.RESET_SELECTION
    });
    dispatch({
      type: actions.FILTER_LINKS_BY_NODES
    });
    selectView(false, true);
    dispatch(loadLinks());
  };
}
export function selectCountry(country, reloadLinks) {
  return _reloadLinks('country', country, actions.SELECT_COUNTRY, reloadLinks);
}
export function selectCommodity(commodity, reloadLinks) {
  return _reloadLinks('commodity', commodity, actions.SELECT_COMMODITY, reloadLinks);
}
export function selectBiomeFilter(biomeFilter, reloadLinks) {
  return _reloadLinks('biomeFilter', biomeFilter, actions.SELECT_BIOME_FILTER, reloadLinks);
}
export function selectQuant(quant, reloadLinks) {
  return _reloadLinks('quant', quant, actions.SELECT_QUANT, reloadLinks);
}
export function selectRecolorBy(data) {
  if (data.active !== undefined && data.active === 'false') {
    return () => {};
  }
  return dispatch => {
    dispatch({
      type: actions.SELECT_RECOLOR_BY,
      value: data.value,
      value_type: data.type
    });
    dispatch(loadLinks());
  };
}
export function selectView(detailedView, reloadLinks) {
  return _reloadLinks('detailedView', detailedView, actions.SELECT_VIEW, reloadLinks);
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
      commodity: getState().flows.selectedCommodity
    };
    const allNodesURL = getURLFromParams('/v1/get_all_nodes', params);
    const columnsURL = getURLFromParams('/v1/get_columns', params);

    Promise.all([allNodesURL, columnsURL].map(url =>
      fetch(url).then(resp => resp.text())
    )).then(payload => {
      // TODO do not wait for end of all promises/use another .all call
      dispatch({
        type: actions.GET_COLUMNS,
        payload: payload.slice(0, 2),
      });
      dispatch(loadNodes());
      dispatch(loadLinks());
    });
    dispatch(loadMapVectorLayers());
    dispatch(loadMapContextLayers());
  };
}

export function loadNodes() {
  return (dispatch, getState) => {
    dispatch({
      type: actions.LOAD_NODES
    });
    const params = {
      country: getState().flows.selectedCountry.toUpperCase(),
      commodity: getState().flows.selectedCommodity.toUpperCase(),
      year_start: getState().flows.selectedYears[0],
      year_end: getState().flows.selectedYears[1],
      // column_id: 2
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
      commodity: getState().flows.selectedCommodity.toUpperCase(),
      year_start: getState().flows.selectedYears[0],
      year_end: getState().flows.selectedYears[1],
      include_columns: getState().flows.selectedColumnsIds.join(','),
      n_nodes: getState().flows.detailedView === true ? NUM_NODES_DETAILED : NUM_NODES_SUMMARY,
      flow_quant: getState().flows.selectedQuant
    };

    const selectRecolorByType = getState().flows.selectedRecolorBy.type;
    const selectRecolorByValue = getState().flows.selectedRecolorBy.value;
    if (selectRecolorByValue !== 'none') {
      if (selectRecolorByType === 'qual') {
        params.flow_qual = selectRecolorByValue;
      } else if (selectRecolorByType === 'ind') {
        params.flow_ind = selectRecolorByValue;
      }
    }

    const selectedBiomeFilter = getState().flows.selectedBiomeFilter;
    if (selectedBiomeFilter !== 'none') {
      params.biome_filter = selectedBiomeFilter;
    }

    if (getState().flows.areNodesExpanded) {
      // TODO temporary: pick the latest node selected. Eventually could be a set of nodes
      // params.selected_nodes = getState().flows.selectedNodesIds.join(',');
      params.selected_nodes = getState().flows.selectedNodesIds[0];
    }

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

        if (getState().flows.selectedNodesIds && getState().flows.selectedNodesIds.length > 0) {
          dispatch({
            type: actions.FILTER_LINKS_BY_NODES
          });
        }
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

export function loadMapContextLayers() {
  return dispatch => {
    const namedMapsURLs = mapContextualLayers.map(layer => {
      if (layer.rasterURL) {
        return null;
      }
      return `${CARTO_NAMED_MAPS_BASE_URL}${layer.name}/jsonp?callback=cb`;
    }).filter(url => url !== null);

    Promise.all(namedMapsURLs.map(url =>
      fetch(url).then(resp => resp.text())
    )).then(() => {
      // we actually don't care about layergroupids because we already have them pregenerated
      // this is just about reinstanciating named maps, you know, because CARTO
      dispatch({
        type: actions.GET_CONTEXT_LAYERS,
        mapContextualLayers
      });
    });

  };
}

export function selectNode(nodeId, isAggregated) {
  return (dispatch, getState) => {
    if (isAggregated) {
      dispatch(selectView(true));
    } else {
      // unselecting the node that is currently expanded: just shrink it and bail
      const expandedNodesIds = getState().flows.expandedNodesIds;
      if (expandedNodesIds && nodeId === expandedNodesIds[0]) {
        dispatch(toggleNodesExpand());
        return;
      }

      dispatch({
        type: actions.ADD_NODE_TO_SELECTION,
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
      type: actions.ADD_NODE_TO_SELECTION_FROM_GEOID,
      geoId
    });
    dispatch({
      type: actions.FILTER_LINKS_BY_NODES
    });
  };
}

export function highlightNode(nodeId, isAggregated) {
  return (dispatch, getState) => {
    if (isAggregated) {
      return;
    }

    // TODO move this to reducer
    if (getState().flows.selectedNodesIds.indexOf(nodeId) > -1) {
      return;
    }

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

export function toggleNodesExpand(reloadLinks = true) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.TOGGLE_NODES_EXPAND
    });

    // if expanding, and if in detailed mode, toggle to overview mode
    if (getState().flows.areNodesExpanded === true && getState().flows.detailedView === true) {
      dispatch({
        type: actions.SELECT_VIEW,
        detailedView: false,
        forcedOverview: true
      });
    }

    // if shrinking, and if overview was previously forced, go back to detailed
    else if (getState().flows.areNodesExpanded === false && getState().flows.forcedOverview === true) {
      dispatch({
        type: actions.SELECT_VIEW,
        detailedView: true,
        forcedOverview: false
      });
    }


    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
}

export function searchNode(nodeId) {
  return (dispatch, getState) => {
    const currentVisibleNodesIds = getState().flows.visibleNodes.map(node => node.id);
    if (currentVisibleNodesIds.indexOf(nodeId) === -1) {

      // check if we need to swap column
      const node = getState().flows.nodesDict[nodeId];
      const columnPos = node.columnPosition;
      const currentColumnAtPos = getState().flows.selectedColumnsIds[columnPos];

      if (!node) {
        console.warn(`requested node ${nodeId} does not exist in nodesDict`);
        return;
      }
      if (currentColumnAtPos !== node.columnId) {
        dispatch(selectColumn(columnPos, node.columnId));
      }
      dispatch(selectView(true));
      dispatch({
        type: actions.SELECT_SINGLE_NODE,
        nodeId
      });
    } else {
      dispatch(selectNode(nodeId, false));
    }


  };
}
