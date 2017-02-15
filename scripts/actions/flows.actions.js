import actions from 'actions';
import * as topojson from 'topojson';
import { NUM_NODES_SUMMARY, NUM_NODES_DETAILED, NUM_NODES_EXPANDED, CARTO_NAMED_MAPS_BASE_URL } from 'constants';
import getURLFromParams from 'utils/getURLFromParams';
import mapContextualLayers from './map/context_layers';
import getNodeIdFromGeoId from './helpers/getNodeIdFromGeoId';
import getNodesSelectionAction from './helpers/getNodesSelectionAction';
import getSelectedNodesStillVisible from './helpers/getSelectedNodesStillVisible';
import setGeoJSONMeta from './helpers/setGeoJSONMeta';


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

export function selectColumn(columnIndex, columnId, reloadLinks = true) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_COLUMN,
      columnIndex,
      columnId
    });
    if (reloadLinks) {
      dispatch(loadLinks());
    }
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
      dispatch(loadMapVectorLayers());
      dispatch(loadMapContextLayers());
    });
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
      flow_quant: getState().flows.selectedQuant
    };

    if (getState().flows.detailedView === true) {
      params.n_nodes = NUM_NODES_DETAILED;
    } else if (getState().flows.areNodesExpanded === true) {
      params.n_nodes = NUM_NODES_EXPANDED;
    } else {
      params.n_nodes = NUM_NODES_SUMMARY;

    }

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

        // reselect nodes ---> FILTER NODE IDS THAT ARE NOT VISIBLE ANYMORE + UPDATE DATA for titlebar
        const selectedNodesIds = getSelectedNodesStillVisible(getState().flows.visibleNodes, getState().flows.selectedNodesIds);

        const action = getNodesSelectionAction(selectedNodesIds, getState().flows);
        action.type = actions.UPDATE_NODE_SELECTION;
        dispatch(action);

        if (getState().flows.selectedNodesIds && getState().flows.selectedNodesIds.length > 0) {
          dispatch({
            type: actions.FILTER_LINKS_BY_NODES
          });
        }

        // load related geoIds to show on the map
        dispatch(loadLinkedGeoIDs());
      });
  };
}


export function loadMapVectorLayers() {
  return (dispatch, getState) => {
    // get columns at position 0
    // exclude logistics hubs which doesnt have its own topojson
    const geoColumns = getState().flows.columns.filter(column => column.position === 0);
    const geoColumnsWithTopoJSON = geoColumns.filter(column => column.id !== 2);
    const geoJSONUrls = geoColumnsWithTopoJSON.map(geoColumn => `${geoColumn.name}.topo.json`);
    Promise.all(geoJSONUrls.map(url =>
      fetch(url).then(resp => resp.text())
    )).then(payload => {
      const geoData = {};
      geoColumnsWithTopoJSON.forEach((geoColumn, i) => {
        const layerPayload = payload[i];
        const topoJSON = JSON.parse(layerPayload);
        const key = Object.keys(topoJSON.objects)[0];
        const geoJSON = topojson.feature(topoJSON, topoJSON.objects[key]);
        setGeoJSONMeta(geoJSON, getState().flows.nodesDict, getState().flows.geoIdsDict, geoColumn.id);
        geoData[geoColumn.name] = geoJSON;
      });

      dispatch({
        type: actions.GET_GEO_DATA,
        geoData
      });
    });
  };
}

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

export function selectNode(nodeId, isAggregated = false) {
  return (dispatch, getState) => {
    if (isAggregated) {
      dispatch(selectView(true));
    } else {
      const expandedNodesIds = getState().flows.expandedNodesIds;
      // we are unselecting the node that is currently expanded: just shrink it and bail
      if (expandedNodesIds && nodeId === expandedNodesIds[0]) {
        dispatch(toggleNodesExpand());
        return;
      }

      // remove or add nodeId from selectedNodesIds
      const currentSelectedNodesIds = getState().flows.selectedNodesIds;
      let selectedNodesIds;
      let nodeIndex = currentSelectedNodesIds.indexOf(nodeId);
      if (nodeIndex > -1) {
        selectedNodesIds = [].concat(currentSelectedNodesIds);
        selectedNodesIds.splice(nodeIndex, 1);
      } else {
        selectedNodesIds = [nodeId].concat(currentSelectedNodesIds);
      }



      // send to state the new node selection allong with new data, geoIds, etc
      const action = getNodesSelectionAction(selectedNodesIds, getState().flows);
      action.type = actions.UPDATE_NODE_SELECTION;
      dispatch(action);

      // refilter links by selected nodes
      dispatch({
        type: actions.FILTER_LINKS_BY_NODES
      });

      // load related geoIds to show on the map
      dispatch(loadLinkedGeoIDs());
    }
  };
}

export function selectNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const nodeId = getNodeIdFromGeoId(geoId, getState().flows.nodesDict, getState().flows.selectedColumnsIds[0]);

    // node not in visible Nodes ---> expand node (same behavior as search)
    if (!_isNodeVisible(getState, nodeId)) {
      dispatch(toggleNodesExpand(true, nodeId));
    } else {
      dispatch(selectNode(nodeId, false));
    }
  };
}

export function highlightNode(nodeId, isAggregated) {
  return (dispatch, getState) => {
    if (isAggregated) {
      return;
    }

    if (getState().flows.selectedNodesIds.indexOf(nodeId) > -1) {
      return;
    }

    const action = getNodesSelectionAction([nodeId], getState().flows);
    action.type = actions.HIGHLIGHT_NODE;
    dispatch(action);
  };
}

export function highlightNodeFromGeoId(geoId) {
  return (dispatch, getState) => {
    const nodeId = getNodeIdFromGeoId(geoId, getState().flows.nodesDict, getState().flows.selectedColumnsIds[0]);
    dispatch(highlightNode(nodeId, false));
  };
}

export function toggleNodesExpand(forceExpand = false, forceExpandNodeId) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.TOGGLE_NODES_EXPAND,
      forceExpand,
      forceExpandNodeId
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

    dispatch(loadLinks());
    // load related geoIds to show on the map
    dispatch(loadLinkedGeoIDs());
  };
}

export function searchNode(nodeId) {
  return (dispatch, getState) => {
    if (!_isNodeVisible(getState, nodeId)) {

      // check if we need to swap column
      const node = getState().flows.nodesDict[nodeId];
      const columnPos = node.columnPosition;
      const currentColumnAtPos = getState().flows.selectedColumnsIds[columnPos];

      if (!node) {
        console.warn(`requested node ${nodeId} does not exist in nodesDict`);
        return;
      }
      if (currentColumnAtPos !== node.columnId) {
        dispatch(selectColumn(columnPos, node.columnId, false));
      }
      // 1. before: go to detailed mode and select
      // dispatch(selectView(true));
      // 2. as per SEI request: go to expanded node
      dispatch(toggleNodesExpand(true, nodeId));

    } else {
      dispatch(selectNode(nodeId, false));
    }
  };
}

export function loadLinkedGeoIDs() {
  return () => {};
  //TODO: pending https://github.com/sei-international/TRASE/issues/165
  // return (dispatch, getState) => {
  //   return;
  //   const selectedNodesIds = getState().flows.selectedNodesIds;
  //   if (selectedNodesIds.length === 0) {
  //     dispatch({
  //       type: actions.GET_LINKED_GEOIDS,
  //       payload: {data:{}}
  //     });
  //     return;
  //   }
  //   dispatch({
  //     type: actions.LOAD_MAP
  //   });
  //   const params = {
  //     node_ids: selectedNodesIds.join(','),
  //     column_id: getState().flows.selectedColumnsIds[0]
  //   };
  //   // const url = getURLFromParams('/v1/get_linked_geoids', params);
  //   const url = 'get_linked_geoids.json';
  //
  //   fetch(url)
  //     .then(res => res.text())
  //     .then(payload => {
  //       dispatch({
  //         type: actions.GET_LINKED_GEOIDS,
  //         payload: JSON.parse(payload)
  //       });
  //     });
  // };
}

const _isNodeVisible = (getState, nodeId) => getState().flows.visibleNodes.map(node => node.id).indexOf(nodeId) > -1;
