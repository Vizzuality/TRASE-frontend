import _ from 'lodash';
import actions from 'actions';
import { encodeStateToURL } from 'utils/stateURL';
import { GA_ACTION_WHITELIST } from 'constants';
import getNodesDict from './helpers/getNodesDict';
import getVisibleNodes from './helpers/getVisibleNodes';
import splitVisibleNodesByColumn from './helpers/splitVisibleNodesByColumn';
import getVisibleColumns from './helpers/getVisibleColumns';
import splitLinksByColumn from './helpers/splitLinksByColumn';
import sortVisibleNodes from './helpers/sortVisibleNodes';
import mergeLinks from './helpers/mergeLinks';
import filterLinks from './helpers/filterLinks';
import getMapVariables from './helpers/getMapVariables';
import setNodesMeta from './helpers/setNodesMeta';
import getChoropleth from './helpers/getChoropleth';
import getNodesAtColumns from './helpers/getNodesAtColumns';
import getNodesColoredBySelection from './helpers/getNodesColoredBySelection';
import getRecolorGroups from './helpers/getRecolorGroups';

export default function (state = {}, action) {
  let newState;
  let updateURLState = true;

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
      selectedBiomeFilter: 'none',
      recolourByNodeIds: []
    });
    break;
  }

  case actions.GET_COLUMNS: {
    const rawNodes = JSON.parse(action.payload[0]).data;
    const columns = JSON.parse(action.payload[1]).data;
    const { nodesDict, geoIdsDict } = getNodesDict(rawNodes, columns);
    newState = Object.assign({}, state, { columns, nodesDict, geoIdsDict, initialDataLoading: false });
    break;
  }

  case actions.LOAD_LINKS:
    newState = Object.assign({}, state, { linksLoading: true });
    break;

  case actions.GET_NODES: {
    const nodesMeta = action.payload.nodesJSON.data;

    const mapVariablesMeta = action.payload.mapVariablesMetaJSON;
    const rawMapVariables = mapVariablesMeta.variables;
    const mapVariables = getMapVariables(rawMapVariables);

    const mapVariablesFolders = mapVariablesMeta.folders;

    // store layer values in nodesDict as uid: layerValue
    const nodesDictWithMeta = setNodesMeta(state.nodesDict, nodesMeta, mapVariables);

    newState = Object.assign({}, state, { mapVariables, mapVariablesFolders, nodesDictWithMeta });
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

  case actions.GET_LINKED_GEOIDS: {
    const linkedGeoIds = action.payload.map(node => node.geo_id);

    newState = Object.assign({}, state, { linkedGeoIds });
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
      selectedNodesColumnsPos: action.columnsPos,
      selectedNodesColorGroups: action.colorGroups,
    });
    // console.log(newState.selectedNodesColorGroups)
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
    const selectedNodesAtColumns = getNodesAtColumns(state.selectedNodesIds, state.selectedNodesColumnsPos);

    const nodesColoredBySelection = getNodesColoredBySelection(selectedNodesAtColumns);
    let recolorGroups = getRecolorGroups(state.nodesColoredBySelection, nodesColoredBySelection, state.recolorGroups);

    let links;
    if (state.selectedNodesIds.length > 0) {
      const filteredLinks = filterLinks(state.unmergedLinks, selectedNodesAtColumns, nodesColoredBySelection, recolorGroups);
      links =  mergeLinks(filteredLinks, true);
    } else {
      links = mergeLinks(state.unmergedLinks);
    }

    newState = Object.assign({}, state, { links, nodesColoredBySelection, recolorGroups});
    break;
  }

  case actions.GET_MAP_VECTOR_DATA: {
    newState = Object.assign({}, state, { mapVectorData: action.mapVectorData });
    break;
  }

  case actions.GET_CONTEXT_LAYERS: {
    newState = Object.assign({}, state, { mapContextualLayers: action.mapContextualLayers });
    break;
  }

  case actions.SELECT_MAP_VARIABLES: {
    const selectedMapVariables = Object.assign({}, state.selectedMapVariables);
    const currentUidForDirection = selectedMapVariables[action.variableData.direction].uid;
    const nextUid = action.variableData.uid;
    selectedMapVariables[action.variableData.direction] = {
      title: action.variableData.title,
      uid: (currentUidForDirection === nextUid) ? null : nextUid
    };

    // get a geoId <-> color dict
    const choropleth = (selectedMapVariables.horizontal.uid === null && selectedMapVariables.vertical.uid === null) ?
      {} :
      getChoropleth(selectedMapVariables, state.nodesDictWithMeta);

    newState = Object.assign({}, state, { selectedMapVariables, choropleth });
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
      expandedNodesIds = action.forceExpandNodeIds;
      selectedNodesIds = action.forceExpandNodeIds;
    } else {
      expandedNodesIds = (state.areNodesExpanded) ? [] : state.selectedNodesIds;
      selectedNodesIds = state.selectedNodesIds;
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

  if (typeof ga !== 'undefined') {
    const gaAction = GA_ACTION_WHITELIST.find(whitelistAction => action.type === whitelistAction.type);
    if (gaAction) {
      const gaEvent = {
        hitType: 'event',
        eventCategory: 'Sankey',
        eventAction: gaAction.type
      };
      if (gaAction.getPayload) {
        gaEvent.eventLabel  = gaAction.getPayload(action, state);
      }
      ga('send', gaEvent);
    }
  }

  return newState;
}
