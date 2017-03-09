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
import getMapDimensions from './helpers/getMapDimensions';
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

    const selectedColumnsIds = [];
    columns.forEach(column => {
      if (column.isDefault) {
        selectedColumnsIds.push(column.id);
      }
    });

    // TODO temp hacks while this gets implementend in the API
    columns.forEach(column => {
      if (column.group === 0) {
        column.isGeo = true;
      }
    });
    const municipalitiesColumn = columns.find(column => column.name === 'MUNICIPALITY');
    const logisticsHubColumn = columns.find(column => column.name === 'LOGISTICS HUB');
    logisticsHubColumn.useGeometryFromColumnId = municipalitiesColumn.id;

    const { nodesDict, geoIdsDict } = getNodesDict(rawNodes, columns);
    newState = Object.assign({}, state, { columns, nodesDict, geoIdsDict, initialDataLoading: false, selectedColumnsIds });
    break;
  }

  case actions.LOAD_LINKS:
    newState = Object.assign({}, state, { linksLoading: true });
    break;

  case actions.GET_NODES: {
    const nodesMeta = action.payload.nodesJSON.data;

    const mapDimensionsMeta = action.payload.mapDimensionsMetaJSON;
    const rawMapDimensions = mapDimensionsMeta.dimensions;
    const mapDimensions = getMapDimensions(rawMapDimensions);

    const mapDimensionsFolders = mapDimensionsMeta.dimensionGroups;
    // store dimension values in nodesDict as uid: dimensionValue
    const nodesDictWithMeta = setNodesMeta(state.nodesDict, nodesMeta, mapDimensions);

    newState = Object.assign({}, state, { mapDimensions, mapDimensionsFolders, nodesDictWithMeta });
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
    if (selectedColumnsIds.indexOf(action.columnId) === -1) {
      selectedColumnsIds[action.columnIndex] = action.columnId;
    }

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

  case actions.SELECT_MAP_DIMENSIONS: {
    const selectedMapDimensions = Object.assign({}, state.selectedMapDimensions);
    const currentUidForDirection = selectedMapDimensions[action.dimensionData.direction].uid;
    const nextUid = action.dimensionData.uid;
    selectedMapDimensions[action.dimensionData.direction] = {
      title: action.dimensionData.title,
      uid: (currentUidForDirection === nextUid) ? null : nextUid
    };

    // get a geoId <-> color dict
    const choropleth = (selectedMapDimensions.horizontal.uid === null && selectedMapDimensions.vertical.uid === null) ?
      {} :
      getChoropleth(selectedMapDimensions, state.nodesDictWithMeta);

    newState = Object.assign({}, state, { selectedMapDimensions, choropleth });
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

  case actions.SELECT_BASEMAP: {
    newState = Object.assign({}, state, { selectedMapBasemap: action.selectedMapBasemap });
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
