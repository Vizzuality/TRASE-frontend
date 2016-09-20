import _ from 'lodash';
import actions from 'actions';
import getNodesDict from './sankey/getNodesDict';
import getVisibleNodes from './sankey/getVisibleNodes';
import getColumns from './sankey/getColumns';
import getLinks from './sankey/getLinks';
import mergeLinks from './sankey/mergeLinks';

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
  case actions.HIGHLIGHT_NODE:
    return Object.assign({}, state, { highlightedNodeId: action.id });
  case actions.SELECT_NODE: {
    const currentIndex = state.selectedNodesIds.indexOf(action.id);
    let selectedNodesIds;
    console.log(action.id)
    if (currentIndex > -1) {
      selectedNodesIds = _.without(state.selectedNodesIds, action.id);
    } else {
      selectedNodesIds = [action.id].concat(state.selectedNodesIds);
    }
    return Object.assign({}, state, { selectedNodesIds: selectedNodesIds });
  }
  default:
    return state;
  }
}
