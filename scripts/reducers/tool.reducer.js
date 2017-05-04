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
        selectedBiomeFilter: { value: 'none' },
        recolorByNodeIds: []
      });
      break;
    }
    case actions.LOAD_CONTEXTS: {
      newState = Object.assign({}, state, { contexts: action.payload });
      break;
    }

    case actions.LOAD_INITIAL_CONTEXT: {
      let context = state.contexts.find(context => context.id === state.selectedContextId);
      if (!context) {
        context = state.contexts.find(context => context.isDefault === true);
      }

      let recolorBy = context.recolorBy.find(recolorBy => recolorBy.name === state.selectedRecolorByName);
      if (!recolorBy) {
        recolorBy = context.recolorBy.find(recolorBy => recolorBy.isDefault === true);
      }

      let resizeBy;
      if (state.selectedResizeByName === 'none') {
        resizeBy = { type: 'none', name: 'none' };
      } else {
        resizeBy = context.resizeBy.find(resizeBy => resizeBy.name === state.selectedResizeByName);
        if (!recolorBy) {
          resizeBy = context.resizeBy.find(resizeBy => resizeBy.isDefault === true);
        }
      }

      let biomeFilter;
      if (state.selectedBiomeFilterName === 'none' || !context.filterBy.length) {
        biomeFilter = { value: 'none' };
      } else {
        biomeFilter = context.filterBy[0].nodes.find(filterBy => filterBy.name === state.selectedBiomeFilterName);
      }

      // force state updates on the component
      let selectedYears = (state.selectedYears) ? Object.assign([], state.selectedYears) : [context.defaultYear, context.defaultYear];
      let mapView = (state.mapView) ? Object.assign({}, state.mapView) : context.map;

      newState = Object.assign({}, state, {
        selectedContext: context,
        selectedContextId: context.id,
        selectedYears,
        selectedRecolorBy: recolorBy || { type: 'none', name: 'none' },
        selectedResizeBy: resizeBy,
        selectedBiomeFilter: biomeFilter || { value: 'none' },
        mapView
      });
      break;
    }

    case actions.SET_CONTEXT: {
      const contextId = action.payload;
      const context = state.contexts.find(context => context.id === contextId);
      const defaultRecolorBy = context.recolorBy.find(recolorBy => recolorBy.isDefault === true);
      const defaultResizeBy = context.resizeBy.find(resizeBy => resizeBy.isDefault === true);
      const defaultFilterBy = context.filterBy.length && context.filterBy[0][0];
      newState = Object.assign({}, state, {
        selectedContext: context,
        selectedContextId: contextId,
        selectedYears: [context.defaultYear, context.defaultYear],
        selectedRecolorBy: defaultRecolorBy || { type: 'none', name: 'none' },
        selectedResizeBy: defaultResizeBy,
        selectedBiomeFilter: defaultFilterBy,
        detailedView: false,
        selectedNodesColorGroups: [],
        recolorGroups: [],
        mapView: context.map
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

      // TODO temp hacks while this gets implemented in the API
      columns.forEach(column => {
        if (column.group === 0) {
          column.isGeo = true;
        }
      });
      const municipalitiesColumn = columns.find(column => column.name === 'MUNICIPALITY');
      const logisticsHubColumn = columns.find(column => column.name === 'LOGISTICS HUB');
      if (logisticsHubColumn && municipalitiesColumn) {
        logisticsHubColumn.useGeometryFromColumnId = municipalitiesColumn.id;
      }

      const { nodesDict, geoIdsDict } = getNodesDict(rawNodes, columns);

      newState = Object.assign({}, state, {
        columns, nodesDict, geoIdsDict, initialDataLoading: false, selectedColumnsIds
      });
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

      const mapDimensionsGroups = mapDimensionsMeta.dimensionGroups.map(group => {
        return {
          group,
          dimensions: mapDimensions.filter(dimension => dimension.groupId === group.id)
        };
      });

      // store dimension values in nodesDict as uid: dimensionValue
      const nodesDictWithMeta = setNodesMeta(state.nodesDict, nodesMeta, mapDimensions);

      newState = Object.assign({}, state, { mapDimensions, mapDimensionsGroups, nodesDictWithMeta });
      break;
    }

    case actions.GET_LINKS: {
      const jsonPayload = JSON.parse(action.payload);
      const rawLinks = jsonPayload.data;
      const linksMeta = jsonPayload.include;

      const currentQuant = linksMeta.quant;

      const visibleNodes = getVisibleNodes(rawLinks, state.nodesDict, linksMeta, state.selectedColumnsIds);

      let visibleNodesByColumn = splitVisibleNodesByColumn(visibleNodes);
      visibleNodesByColumn = sortVisibleNodes(visibleNodesByColumn);

      const visibleColumns = getVisibleColumns(state.columns, state.selectedColumnsIds);

      const unmergedLinks = splitLinksByColumn(rawLinks, state.nodesDict);
      const links = mergeLinks(unmergedLinks);

      newState = Object.assign({}, state, {
        links, unmergedLinks, visibleNodes, visibleNodesByColumn, visibleColumns, currentQuant, linksLoading: false
      });
      break;
    }

    case actions.GET_LINKED_GEOIDS: {
      const linkedGeoIds = (action.payload.length) ? action.payload.map(node => node.geo_id) : [];

      newState = Object.assign({}, state, { linkedGeoIds });
      break;
    }

    case actions.SELECT_BIOME_FILTER: {
      let selectedBiomeFilter;
      if (action.biomeFilter === 'none') {
        selectedBiomeFilter = { value: 'none' };
      } else {
        const currentContext = state.contexts.find(context => context.id === state.selectedContextId);
        selectedBiomeFilter = currentContext.filterBy[0].nodes.find(filterBy => filterBy.name === action.biomeFilter);
      }
      newState = Object.assign({}, state, { selectedBiomeFilter });
      break;
    }

    case actions.SELECT_YEARS:
      newState = Object.assign({}, state, { selectedYears: action.years });
      break;

    case actions.SELECT_RECOLOR_BY: {
      let selectedRecolorBy;
      if (action.value === 'none') {
        selectedRecolorBy = { name: 'none' };
      } else {
        const currentContext = state.contexts.find(context => context.id === state.selectedContextId);
        selectedRecolorBy = currentContext.recolorBy.find(recolorBy => recolorBy.name === action.value && recolorBy.type === action.value_type);
      }
      newState = Object.assign({}, state, { selectedRecolorBy });
      break;
    }
    case actions.SELECT_RESIZE_BY: {
      const currentContext = state.contexts.find(context => context.id === state.selectedContextId);
      const resizeBy = currentContext.resizeBy.find(resizeBy => resizeBy.name === action.resizeBy);
      newState = Object.assign({}, state, { selectedResizeBy: resizeBy });
      break;
    }
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
      break;
    }

    case actions.HIGHLIGHT_NODE: {
      // TODO this prevents spamming browser history, but we should avoid touching it when changed state props are not on th url whitelist (constants.URL_STATE_PROPS)
      updateURLState = false;
      newState = Object.assign({}, state, {
        highlightedNodesIds: action.ids,
        highlightedNodeData: action.data,
        highlightedGeoIds: action.geoIds,
        highlightedNodeCoordinates: action.coordinates
      });
      break;
    }

    case actions.FILTER_LINKS_BY_NODES: {
      const selectedNodesAtColumns = getNodesAtColumns(state.selectedNodesIds, state.selectedNodesColumnsPos);

      const { nodesColoredBySelection, nodesColoredAtColumn } = getNodesColoredBySelection(selectedNodesAtColumns);
      let recolorGroups = getRecolorGroups(state.nodesColoredBySelection, nodesColoredBySelection, state.recolorGroups);

      let links;
      if (state.selectedNodesIds.length > 0) {
        const filteredLinks = filterLinks(state.unmergedLinks, selectedNodesAtColumns, nodesColoredBySelection, recolorGroups);
        links = mergeLinks(filteredLinks, true);
      } else {
        links = mergeLinks(state.unmergedLinks);
      }

      newState = Object.assign({}, state, { links, nodesColoredBySelection, nodesColoredAtColumn, recolorGroups });
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

    case actions.SET_MAP_DIMENSIONS: {
      const selectedMapDimensions = action.uids;
      const choropleth = (selectedMapDimensions[0] === null && selectedMapDimensions[1] === null) ? {} : getChoropleth(selectedMapDimensions, state.nodesDictWithMeta);

      newState = Object.assign({}, state, { selectedMapDimensions,  choropleth });
      break;
    }

    case actions.TOGGLE_MAP_DIMENSION: {
      let selectedMapDimensions = state.selectedMapDimensions.slice();
      let uidIndex = selectedMapDimensions.indexOf(action.uid);
      if (uidIndex === -1) {
        if      (selectedMapDimensions[0] === null)   selectedMapDimensions[0] = action.uid;
        else if (selectedMapDimensions[1] === null)   selectedMapDimensions[1] = action.uid;
        else {
          newState = state;
          break;
        }
      } else {
        selectedMapDimensions[uidIndex] = null;
      }

      // get a geoId <-> color dict
      const choropleth = (selectedMapDimensions[0] === null && selectedMapDimensions[1] === null) ? {} : getChoropleth(selectedMapDimensions, state.nodesDictWithMeta);
      newState = Object.assign({}, state, { selectedMapDimensions, choropleth });
      break;
    }
    case actions.SELECT_CONTEXTUAL_LAYERS: {
      const mapContextualLayersDict = _.keyBy(state.mapContextualLayers, 'name');
      const selectedMapContextualLayersData = action.contextualLayers.map(layerSlug => {
        return _.cloneDeep(mapContextualLayersDict[layerSlug]);
      });
      newState = Object.assign({}, state, {
        selectedMapContextualLayers: action.contextualLayers, selectedMapContextualLayersData
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

    case actions.TOGGLE_MAP: {
      newState = Object.assign({}, state, { isMapVisible: !state.isMapVisible });
      break;
    }

    case actions.SAVE_MAP_VIEW: {
      newState = Object.assign({}, state, { mapView: {
        latitude: action.latlng.lat,
        longitude: action.latlng.lng,
        zoom: action.zoom
      } });
      break;
    }

    case actions.TOGGLE_MAP_SIDEBAR_GROUP: {
      let expandedMapSidebarGroupsIds = state.expandedMapSidebarGroupsIds.slice();
      let idIndex = expandedMapSidebarGroupsIds.indexOf(action.id);
      if (idIndex === -1) {
        expandedMapSidebarGroupsIds.push(action.id);
      } else {
        expandedMapSidebarGroupsIds.splice(idIndex, 1);
      }
      newState = Object.assign({}, state, { expandedMapSidebarGroupsIds });
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
        hitType: 'event', eventCategory: 'Sankey', eventAction: gaAction.type
      };
      if (gaAction.getPayload) {
        gaEvent.eventLabel = gaAction.getPayload(action, state);
      }
      ga('send', gaEvent);
    }
  }

  return newState;
}
