import _ from 'lodash';
import actions from 'actions';
import getNodesDict from './sankey/getNodesDict';
import getVisibleNodes from './sankey/getVisibleNodes';
import getColumns from './sankey/getColumns';
import getLinks from './sankey/getLinks';
import mergeLinks from './sankey/mergeLinks';
import getNodeIdFromGeoId from './sankey/getNodeIdFromGeoId';

const initialState = {
  selectedNodesIds: [],
  selectedQuant: 'Deforestation risk'
};

export default function (state = initialState, action) {
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
    const rawLinks = JSON.parse(action.payload).data;
    const nodesMeta = JSON.parse(action.payload).include;
    const visibleNodes = getVisibleNodes(rawLinks, state.nodesDict, nodesMeta, action.columnIndexes);
    const columns = getColumns(state.columns, action.columnIndexes);
    const links = mergeLinks(getLinks(rawLinks, state.nodesDict));
    return Object.assign({}, state, { linksPayload: { links, visibleNodes, columns}, linksLoading: false });
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
  case actions.HIGHLIGHT_NODE:
    return Object.assign({}, state, { highlightedNodeId: action.id });
  case actions.SELECT_NODE: {
    const selectedNodeIds = getSelectedNodeIds(action.nodeId, state.selectedNodeIds);
    return Object.assign({}, state, { selectedNodeIds });
  }
  case actions.GET_GEO_DATA:
    return Object.assign({}, state, { 
      geoData: {
        municipalities: JSON.parse(action.payload[0]),
        states: JSON.parse(action.payload[1]),
        biomes: JSON.parse(action.payload[2])
      }
    });
  case actions.SELECT_NODE_FROM_GEOID: {
    const nodeId = getNodeIdFromGeoId(action.geoId, state.nodesDict);
    const selectedNodeIds = getSelectedNodeIds(nodeId, state.selectedNodeIds);
    return Object.assign({}, state, { selectedNodeIds });
  }
  default:
    return state;
  }
}

const getSelectedNodeIds = (addedNodeId, currentSelectedNodeIds) => {
  const currentIndex = currentSelectedNodeIds.indexOf(addedNodeId);
  let selectedNodeIds;
  if (currentIndex > -1) {
    selectedNodeIds = _.without(currentSelectedNodeIds, addedNodeId);
  } else {
    selectedNodeIds = [addedNodeId].concat(currentSelectedNodeIds);
  }
  return selectedNodeIds;
};
