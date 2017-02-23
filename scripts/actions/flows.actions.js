import actions from 'actions';
import * as topojson from 'topojson';
import { NUM_NODES_SUMMARY, NUM_NODES_DETAILED, NUM_NODES_EXPANDED, CARTO_NAMED_MAPS_BASE_URL } from 'constants';
import getURLFromParams from 'utils/getURLFromParams';
import mapContextualLayers from './map/context_layers';
import getNodeIdFromGeoId from './helpers/getNodeIdFromGeoId';
import getNodesSelectionAction from './helpers/getNodesSelectionAction';
import getSelectedNodesStillVisible from './helpers/getSelectedNodesStillVisible';
import setGeoJSONMeta from './helpers/setGeoJSONMeta';
import getNodeMetaUid from 'reducers/helpers/getNodeMetaUid';

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

export function selectMapVariable(variableData) {
  return dispatch => {
    dispatch({
      type: actions.SELECT_MAP_VARIABLES,
      variableData
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
      dispatch(loadMapVectorData());
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

    const getNodesURL = getURLFromParams('/v1/get_nodes', params);
    const getMapVariablesMetadataURL = 'jsonMockups/get_map_variables_metadata.json';

    Promise.all([getNodesURL, getMapVariablesMetadataURL].map(url =>
      fetch(url).then(resp => resp.text())
    )).then(rawPayload => {
      const payload = {
        nodesJSON: JSON.parse(rawPayload[0]),
        mapVariablesMetaJSON: JSON.parse(rawPayload[1])
      };

      dispatch({
        type: actions.GET_NODES,
        payload
      });

      const selection = payload.mapVariablesMetaJSON.default_selection;
      if (selection !== undefined) {
        selection.forEach((selection, index) => {
          const direction = (index === 0) ? 'vertical' : 'horizontal';
          const selectedVariable = getState().flows.mapVariables.find(variable => variable.id === selection);
          dispatch(selectMapVariable({
            direction,
            title: selectedVariable.name,
            uid: getNodeMetaUid(selectedVariable.type, selectedVariable.id)
          }));
        });
      }
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
      params.selected_nodes = getState().flows.expandedNodesIds.join(',');
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


export function loadMapVectorData() {
  return (dispatch, getState) => {
    // get columns at position 0
    // exclude logistics hubs which doesnt have its own topojson
    const geoColumns = getState().flows.columns.filter(column => column.position === 0);
    const geoColumnsWithTopoJSON = geoColumns.filter(column => column.id !== 2);
    const geoJSONUrls = geoColumnsWithTopoJSON.map(geoColumn => `${geoColumn.name}.topo.json`);
    Promise.all(geoJSONUrls.map(url =>
      fetch(url).then(resp => resp.text())
    )).then(payload => {
      const mapVectorData = {};
      geoColumnsWithTopoJSON.forEach((geoColumn, i) => {
        const layerPayload = payload[i];
        const topoJSON = JSON.parse(layerPayload);
        const key = Object.keys(topoJSON.objects)[0];
        const geoJSON = topojson.feature(topoJSON, topoJSON.objects[key]);
        setGeoJSONMeta(geoJSON, getState().flows.nodesDict, getState().flows.geoIdsDict, geoColumn.id);
        mapVectorData[geoColumn.name] = geoJSON;
      });

      dispatch({
        type: actions.GET_MAP_VECTOR_DATA,
        mapVectorData
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

// remove or add nodeId from selectedNodesIds
function getSelectedNodeIds(currentSelectedNodesIds, chengedNodeId) {
  let selectedNodesIds;
  let nodeIndex = currentSelectedNodesIds.indexOf(chengedNodeId);
  if (nodeIndex > -1) {
    selectedNodesIds = [].concat(currentSelectedNodesIds);
    selectedNodesIds.splice(nodeIndex, 1);
  } else {
    selectedNodesIds = [chengedNodeId].concat(currentSelectedNodesIds);
  }
  return selectedNodesIds;
}

export function selectNode(nodeId, isAggregated = false) {
  return (dispatch, getState) => {
    if (isAggregated) {
      dispatch(selectView(true));
    } else {
      const currentSelectedNodesIds = getState().flows.selectedNodesIds;
      // we are unselecting the node that is currently expanded: just shrink it and bail
      if (getState().flows.areNodesExpanded &&
        currentSelectedNodesIds.length === 1 &&
        currentSelectedNodesIds.indexOf(nodeId) > -1
      ) {
        dispatch(toggleNodesExpand());
      }

      const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, nodeId);

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
      const currentSelectedNodesIds = getState().flows.selectedNodesIds;
      const selectedNodesIds = getSelectedNodeIds(currentSelectedNodesIds, nodeId);
      dispatch(toggleNodesExpand(true, selectedNodesIds));
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

export function toggleNodesExpand(forceExpand = false, forceExpandNodeIds) {
  return (dispatch, getState) => {
    dispatch({
      type: actions.TOGGLE_NODES_EXPAND,
      forceExpand,
      forceExpandNodeIds
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
  return (dispatch, getState) => {
    const selectedNodesIds = getState().flows.selectedNodesIds;

    // when selection only contains geo nodes (column 0), we should not call get_linked_geoids
    const selectedNodesColumnsPos = getState().flows.selectedNodesColumnsPos;
    const selectedNonGeoNodeIds = selectedNodesIds.filter((nodeId, index) => {
      return selectedNodesColumnsPos[index] !== 0;
    });
    if (selectedNonGeoNodeIds.length === 0) {
      dispatch({
        type: actions.GET_LINKED_GEOIDS,
        payload: []
      });
      return;
    }
    // const params = {
    //  country: getState().flows.selectedCountry.toUpperCase(),
        // commodity: getState().flows.selectedCommodity.toUpperCase(),
        // year_start: getState().flows.selectedYears[0],
        // year_end: getState().flows.selectedYears[1],
    //   node_id: selectedNodesIds.join(','),
    //   target_column_id: getState().flows.selectedColumnsIds[0]
    // };
    // const url = getURLFromParams('/v1/get_linked_geoids', params);
    const url = 'jsonMockups/get_linked_geoids.json';

    fetch(url)
      .then(res => res.text())
      .then(payload => {
        dispatch({
          type: actions.GET_LINKED_GEOIDS,
          payload: JSON.parse(payload)
        });
      });
  };
}

const _isNodeVisible = (getState, nodeId) => getState().flows.visibleNodes.map(node => node.id).indexOf(nodeId) > -1;
