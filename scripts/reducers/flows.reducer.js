import _ from 'lodash';
import actions from 'actions';
import getNodesDict from './sankey/getNodesDict';
import getVisibleNodes from './sankey/getVisibleNodes';
import sortVisibleNodesByColumn from './sankey/sortVisibleNodesByColumn';
import getVisibleColumns from './sankey/getVisibleColumns';
import splitLinksByColumn from './sankey/splitLinksByColumn';
import mergeLinks from './sankey/mergeLinks';
import filterLinks from './sankey/filterLinks';
import getNodeIdFromGeoId from './sankey/getNodeIdFromGeoId';

export default function (state = {}, action) {
  switch (action.type) {

  case actions.LOAD_INITIAL_DATA:
    return Object.assign({}, state, { initialDataLoading: true });

  case actions.GET_COLUMNS: {
    const rawNodes = JSON.parse(action.payload[0]).data;
    const rawColumns = JSON.parse(action.payload[1]).data;
    const nodesDict = getNodesDict(rawNodes);
    return Object.assign({}, state, { columns: rawColumns, nodesDict, initialDataLoading: false });
  }

  case actions.LOAD_LINKS:
    return Object.assign({}, state, { linksLoading: true });

  case actions.GET_LINKS: {
    const jsonPayload = JSON.parse(action.payload);
    const rawLinks = jsonPayload.data;
    const nodesMeta = jsonPayload.include;
    const visibleNodes = getVisibleNodes(rawLinks, state.nodesDict, nodesMeta, state.selectedColumnsIds);
    const visibleNodesByColumn = sortVisibleNodesByColumn(visibleNodes);
    const visibleColumns = getVisibleColumns(state.columns, state.selectedColumnsIds);
    const unmergedLinks = splitLinksByColumn(rawLinks, state.nodesDict);
    const links = mergeLinks(unmergedLinks);
    return Object.assign({}, state, { links, unmergedLinks, visibleNodes, visibleNodesByColumn, visibleColumns, linksLoading: false });
  }

  case actions.SELECT_COUNTRY:
    return Object.assign({}, state, { selectedCountry: action.country });

  case actions.SELECT_COMMODITY:
    return Object.assign({}, state, { selectedCommodity: action.commodity });

  case actions.SELECT_YEARS:
    return Object.assign({}, state, { selectedYears: action.years });

  case actions.SELECT_QUAL:
    return Object.assign({}, state, { selectedQual: action.qual });

  case actions.SELECT_QUANT:
    return Object.assign({}, state, { selectedQuant: action.quant });

  case actions.SELECT_COLOR:
    return Object.assign({}, state, { selectedColor: action.color });

  case actions.SELECT_VIEW:
    return Object.assign({}, state, { selectedView: action.view });

  case actions.SELECT_COLUMN: {
    const selectedColumnsIds = [].concat(state.selectedColumnsIds);
    selectedColumnsIds[action.columnIndex] = action.columnId;
    return Object.assign({}, state, { selectedColumnsIds });
  }

  case actions.HIGHLIGHT_NODE:
    return Object.assign({}, state, { highlightedNodeId: action.id });

  case actions.SELECT_NODE: {
    const selectedNodesIds = getSelectedNodesIds(action.nodeId, state.selectedNodesIds);
    return Object.assign({}, state, { selectedNodesIds });
  }

  case actions.SELECT_NODE_FROM_GEOID: {
    const nodeId = getNodeIdFromGeoId(action.geoId, state.visibleNodes);
    // node not found in visible nodes: abort
    if (nodeId === null) return state;

    const selectedNodesIds = getSelectedNodesIds(nodeId, state.selectedNodesIds);
    return Object.assign({}, state, { selectedNodesIds });

  }
  case actions.FILTER_LINKS_BY_NODES: {
    let links;
    if (state.selectedNodesIds.length > 0) {
      const filteredLinks = filterLinks(state.unmergedLinks, state.selectedNodesIds);
      links = mergeLinks(filteredLinks);
    } else {
      links = mergeLinks(state.unmergedLinks);
    }
    return Object.assign({}, state, { links });
  }

  case actions.GET_GEO_DATA:
    return Object.assign({}, state, {
      geoData: {
        municipalities: JSON.parse(action.payload[0]),
        states: JSON.parse(action.payload[1]),
        biomes: JSON.parse(action.payload[2]),
        currentLayer: state.selectedColumnsIds[0]
      }
    });


  case actions.SELECT_VECTOR_LAYERS: {
    const selectedVectorLayers = Object.assign({}, state.selectedVectorLayers);
    const currentSlugForDirection = selectedVectorLayers[action.layerData.direction].layerSlug;
    const nextSlug = action.layerData.layerSlug;
    selectedVectorLayers[action.layerData.direction] = {
      title: action.layerData.title,
      layerSlug: (currentSlugForDirection === nextSlug) ? null : nextSlug
    };
    return Object.assign({}, state, { selectedVectorLayers });
  }
  case actions.SELECT_CONTEXTUAL_LAYERS: {
    return Object.assign({}, state, { selectedContextualLayers: action.contextualLayers});
  }
  default:
    return state;
  }
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
