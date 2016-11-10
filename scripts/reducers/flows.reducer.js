import _ from 'lodash';
import actions from 'actions';
import { encodeStateToURL } from 'utils/stateURL';
import { LEGEND_COLORS } from 'constants';
import getNodesDict from './sankey/getNodesDict';
import getVisibleNodes from './sankey/getVisibleNodes';
import splitVisibleNodesByColumn from './sankey/splitVisibleNodesByColumn';
import getVisibleColumns from './sankey/getVisibleColumns';
import splitLinksByColumn from './sankey/splitLinksByColumn';
import sortVisibleNodes from './sankey/sortVisibleNodes';
import mergeLinks from './sankey/mergeLinks';
import filterLinks from './sankey/filterLinks';
import getNodeIdFromGeoId from './sankey/getNodeIdFromGeoId';
import getSelectedNodesStillVisible from './sankey/getSelectedNodesStillVisible';
import getSelectedNodesData from './sankey/getSelectedNodesData';
import getMapLayers from './sankey/getMapLayers';
import setNodesMeta from './sankey/setNodesMeta';
import getChoropleth from './sankey/getChoropleth';

export default function (state = {}, action) {
  let newState;

  switch (action.type) {

  case actions.LOAD_INITIAL_DATA: {
    newState = Object.assign({}, state, { initialDataLoading: true });
    break;
  }

  case actions.RESET_SELECTION: {
    newState = Object.assign({}, state, {
      highlightedNodesIds: [],
      highlightedNodeData: [],
      highlightedGeoIds: [],
      selectedNodesIds: [],
      expandedNodesIds: [],
      areNodesExpanded: false,
      selectedBiomeFilter: 'none'
    });
    break;
  }

  case actions.GET_COLUMNS: {
    const rawNodes = JSON.parse(action.payload[0]).data;
    const columns = JSON.parse(action.payload[1]).data;
    const nodesDict = getNodesDict(rawNodes, columns);
    newState = Object.assign({}, state, { columns, nodesDict, initialDataLoading: false });
    break;
  }

  case actions.LOAD_LINKS:
    newState = Object.assign({}, state, { linksLoading: true });
    break;

  case actions.GET_NODES: {
    const jsonPayload = JSON.parse(action.payload);
    const nodesMeta = jsonPayload.data;
    const rawLayers = jsonPayload.include.includedLayers;

    const mapLayers = getMapLayers(rawLayers);

    // store layer values in nodesDict as uid: layerValue
    const nodesDictWithMeta = setNodesMeta(state.nodesDict, nodesMeta, rawLayers);

    newState = Object.assign({}, state, { mapLayers, nodesDictWithMeta });
    break;
  }

  case actions.GET_LINKS: {
    const jsonPayload = JSON.parse(action.payload);
    const rawLinks = jsonPayload.data;
    const nodesMeta = jsonPayload.include;

    const visibleNodes = getVisibleNodes(rawLinks, state.nodesDict, nodesMeta, state.selectedColumnsIds);
    let visibleNodesByColumn = splitVisibleNodesByColumn(visibleNodes);
    visibleNodesByColumn = sortVisibleNodes(visibleNodesByColumn);

    const visibleColumns = getVisibleColumns(state.columns, state.selectedColumnsIds);

    const unmergedLinks = splitLinksByColumn(rawLinks, state.nodesDict);
    const links = mergeLinks(unmergedLinks);

    // we also need to refresh nodes data (used in titles), because values change when year or quant changes
    const selectedNodesData = getSelectedNodesData(state.selectedNodesIds, visibleNodes);

    newState = Object.assign({}, state, {
      links,
      unmergedLinks,
      visibleNodes,
      visibleNodesByColumn,
      visibleColumns,
      selectedNodesData,
      linksLoading: false
    });
    break;
  }


  case actions.SELECT_COUNTRY:
    newState = Object.assign({}, state, { selectedCountry: action.country });
    break;

  case actions.SELECT_COMMODITY:
    newState = Object.assign({}, state, { selectedCommodity: action.commodity });
    break;

  case actions.SELECT_BIOME_FILTER:
    newState = Object.assign({}, state, { selectedBiomeFilter: action.biomeFilter });
    break;

  case actions.SELECT_YEARS:
    newState = Object.assign({}, state, { selectedYears: action.years });
    break;

  case actions.SELECT_RECOLOR_BY:
    newState = Object.assign({}, state, { selectedRecolorBy: { value: action.value, type: action.value_type} });
    break;

  case actions.SELECT_QUANT:
    newState = Object.assign({}, state, { selectedQuant: action.quant });
    break;

  case actions.SELECT_VIEW:
    newState = Object.assign({}, state, { detailedView: action.detailedView, forcedOverview: action.forcedOverview });
    break;

  case actions.SELECT_COLUMN: {
    // TODO also update choropleth with default selected indicators
    const selectedColumnsIds = [].concat(state.selectedColumnsIds);
    selectedColumnsIds[action.columnIndex] = action.columnId;
    newState = Object.assign({}, state, { selectedColumnsIds });
    break;
  }

  case actions.HIGHLIGHT_NODE: {
    const nodeIds = (action.nodeId === undefined) ? [] : [action.nodeId];
    const highlightedNodeMeta = getNodesMeta(nodeIds, state.visibleNodes);
    newState = Object.assign({}, state, {
      highlightedNodesIds: nodeIds,
      highlightedNodeData: highlightedNodeMeta.selectedNodesData,
      highlightedGeoIds: highlightedNodeMeta.selectedNodesGeoIds
    });
    break;
  }

  case actions.HIGHLIGHT_NODE_FROM_GEOID: {
    const nodeId = getNodeIdFromGeoId(action.geoId, state.visibleNodes);
    if (nodeId === null) {
      newState = Object.assign({}, state, {
        highlightedNodesIds: [],
        // still send geoId even if nodeId not found, because we still want map polygon to highlight
        highlightedGeoIds: [action.geoId],
        highlightedNodeData: []
      });
      break;
    }

    const highlightedNodeMeta = getNodesMeta([nodeId], state.visibleNodes);
    newState = Object.assign({}, state, {
      highlightedNodesIds: [nodeId],
      highlightedNodeData: highlightedNodeMeta.selectedNodesData,
      highlightedGeoIds: [action.geoId]
    });
    break;
  }

  case actions.ADD_NODE_TO_SELECTION: {
    const selectedNodesIds = getSelectedNodesIds(action.nodeId, state.selectedNodesIds);
    const selectedNodesStateUpdates = getNodesMeta(selectedNodesIds, state.visibleNodes);
    selectedNodesStateUpdates.selectedNodesIds = selectedNodesIds;
    newState = Object.assign({}, state, selectedNodesStateUpdates);
    break;
  }

  case actions.ADD_NODE_TO_SELECTION_FROM_GEOID: {
    const nodeId = getNodeIdFromGeoId(action.geoId, state.visibleNodes);
    // node not found in visible nodes: abort
    if (nodeId === null) {
      newState = state;
      break;
    }

    const selectedNodesIds = getSelectedNodesIds(nodeId, state.selectedNodesIds);
    const selectedNodesStateUpdates = getNodesMeta(selectedNodesIds, state.visibleNodes);
    selectedNodesStateUpdates.selectedNodesIds = selectedNodesIds;
    newState = Object.assign({}, state, selectedNodesStateUpdates);
    break;
  }

  case actions.SELECT_SINGLE_NODE: {
    newState = Object.assign({}, state, { selectedNodesIds: [action.nodeId] });
    break;
  }

  // this is triggered when links are reloaded to keep track of selected node/links
  case actions.RESELECT_NODES: {
    const selectedNodesIds = getSelectedNodesStillVisible(state.visibleNodes, state.selectedNodesIds);
    const selectedNodesStateUpdates = getNodesMeta(selectedNodesIds, state.visibleNodes);
    selectedNodesStateUpdates.selectedNodesIds = selectedNodesIds;
    newState = Object.assign({}, state, selectedNodesStateUpdates);
    break;
  }


  case actions.FILTER_LINKS_BY_NODES: {
    let links = getFilteredLinksByNodeIds(state.unmergedLinks, state.selectedNodesIds, state.selectedNodesColumnsPos);
    newState = Object.assign({}, state, { links });
    break;
  }

  case actions.GET_GEO_DATA: {
    newState = Object.assign({}, state, {
      geoData: {
        municipalities: JSON.parse(action.payload[0]),
        states: JSON.parse(action.payload[1]),
        biomes: JSON.parse(action.payload[2])
      }
    });
    break;
  }

  case actions.GET_CONTEXT_LAYERS: {
    newState = Object.assign({}, state, { mapContextualLayers: action.mapContextualLayers });
    break;
  }

  case actions.SELECT_VECTOR_LAYERS: {
    const selectedVectorLayers = Object.assign({}, state.selectedVectorLayers);
    const currentUidForDirection = selectedVectorLayers[action.layerData.direction].uid;
    const nextUid = action.layerData.uid;
    selectedVectorLayers[action.layerData.direction] = {
      title: action.layerData.title,
      uid: (currentUidForDirection === nextUid) ? null : nextUid
    };

    // get a geoId <-> color dict
    const choropleth = (selectedVectorLayers.horizontal.uid === null && selectedVectorLayers.vertical.uid === null) ?
      {} :
      getChoropleth(selectedVectorLayers, state.nodesDictWithMeta, LEGEND_COLORS);

    newState = Object.assign({}, state, { selectedVectorLayers, choropleth });
    break;
  }
  case actions.SELECT_CONTEXTUAL_LAYERS: {
    const mapContextualLayersDict = _.keyBy(state.mapContextualLayers, 'name');
    const selectedMapContextualLayersData = action.contextualLayers.map(layerSlug => {
      return _.cloneDeep(mapContextualLayersDict[layerSlug]);
    });
    newState = Object.assign({}, state, {
      selectedMapContextualLayers: action.contextualLayers,
      selectedMapContextualLayersData
    });
    break;
  }

  case actions.TOGGLE_NODES_EXPAND: {
    // TODO temporary: pick the latest node selected. Eventually could be a set of nodes
    const expandedNodesIds = (state.areNodesExpanded) ? []                           : [state.selectedNodesIds[0]];
    const selectedNodesIds = (state.areNodesExpanded) ? [state.expandedNodesIds[0]]  : [state.selectedNodesIds[0]];

    newState = Object.assign({}, state, {
      areNodesExpanded: !state.areNodesExpanded,
      selectedNodesIds,
      expandedNodesIds
    });
    break;
  }

  default:
    newState = state;
    break;
  }

  encodeStateToURL(newState);
  return newState;
}



const getSelectedNodesIds = (addedNodeId, currentSelectedNodesIds) => {
  const currentIndex = currentSelectedNodesIds.indexOf(addedNodeId);
  let selectedNodesIds;
  if (currentIndex > -1) {
    selectedNodesIds = _.without(currentSelectedNodesIds, addedNodeId);
  } else {
    selectedNodesIds = [addedNodeId].concat(currentSelectedNodesIds);
  }
  return selectedNodesIds;
};

const getNodesMeta = (selectedNodesIds, visibleNodes) => {
  // TODO use data from get_nodes API / state.nodesDictWithMeta along with get_flows / visibleNodes
  const selectedNodesData = getSelectedNodesData(selectedNodesIds, visibleNodes);
  const selectedNodesGeoIds = selectedNodesData.map(node => node.geoId).filter(geoId => geoId !== undefined);
  const selectedNodesColumnsPos = selectedNodesData.map(node => node.columnPosition);

  return {
    selectedNodesData,
    selectedNodesGeoIds,
    selectedNodesColumnsPos
  };
};

const getFilteredLinksByNodeIds = (unmergedLinks, selectedNodesIds, selectedNodesColumnsPos) => {
  if (selectedNodesIds.length > 0) {
    const filteredLinks = filterLinks(unmergedLinks, selectedNodesIds, selectedNodesColumnsPos);
    return mergeLinks(filteredLinks);
  } else {
    return mergeLinks(unmergedLinks);
  }
};
