import _ from 'lodash';
import actions from 'actions';
import { encodeStateToURL } from 'utils/stateURL';
import { LEGEND_COLORS } from 'constants';
import getNodesDict from './helpers/getNodesDict';
import getVisibleNodes from './helpers/getVisibleNodes';
import splitVisibleNodesByColumn from './helpers/splitVisibleNodesByColumn';
import getVisibleColumns from './helpers/getVisibleColumns';
import splitLinksByColumn from './helpers/splitLinksByColumn';
import sortVisibleNodes from './helpers/sortVisibleNodes';
import mergeLinks from './helpers/mergeLinks';
import filterLinks from './helpers/filterLinks';
import getMapLayers from './helpers/getMapLayers';
import setNodesMeta from './helpers/setNodesMeta';
import getChoropleth from './helpers/getChoropleth';

export default function (state = {}, action) {
  let newState;
  let updateURLState = true;
console.log(action.type)
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

    newState = Object.assign({}, state, {
      links,
      unmergedLinks,
      visibleNodes,
      visibleNodesByColumn,
      visibleColumns,
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

  case actions.UPDATE_NODE_SELECTION: {
    newState = Object.assign({}, state, {
      selectedNodesIds: action.ids,
      selectedNodesData: action.data,
      selectedNodesGeoIds: action.geoIds,
      selectedNodesColumnsPos: action.columnsPos
    });
    break;
  }

  case actions.HIGHLIGHT_NODE: {
    // TODO this prevents spamming browser history, but we should avoid touching it when changed state props are not on th url whitelist (constants.URL_STATE_PROPS)
    updateURLState = false;
    newState = Object.assign({}, state, {
      highlightedNodesIds: action.ids,
      highlightedNodeData: action.data,
      highlightedGeoIds: action.geoIds
    });
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
    let expandedNodesIds;
    let selectedNodesIds;
    if (action.forceExpand === true) {
      expandedNodesIds = [action.forceExpandNodeId];
      selectedNodesIds = [action.forceExpandNodeId];
    } else {
      // TODO temporary: pick the latest node selected. Eventually could be a set of nodes
      expandedNodesIds = (state.areNodesExpanded && action.forceExpand !== true) ? []                           : [state.selectedNodesIds[0]];
      selectedNodesIds = (state.areNodesExpanded && action.forceExpand !== true) ? [state.expandedNodesIds[0]]  : [state.selectedNodesIds[0]];
    }

    newState = Object.assign({}, state, {
      areNodesExpanded: (action.forceExpand === true) ? true : !state.areNodesExpanded,
      selectedNodesIds,
      expandedNodesIds
    });
    break;
  }

  default:
    newState = state;
    break;
  }

  if (updateURLState) {
    encodeStateToURL(newState);
  }
  return newState;
}

const getFilteredLinksByNodeIds = (unmergedLinks, selectedNodesIds, selectedNodesColumnsPos) => {
  if (selectedNodesIds.length > 0) {
    const filteredLinks = filterLinks(unmergedLinks, selectedNodesIds, selectedNodesColumnsPos);
    return mergeLinks(filteredLinks);
  } else {
    return mergeLinks(unmergedLinks);
  }
};
