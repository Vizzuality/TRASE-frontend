import { selectNode, highlightNode, toggleNodesExpand } from 'actions/flows.actions';
import connect from 'connect';
import Sankey from 'components/sankey.component.js';

const shouldRepositionExpandButton = (expandedNodesIds, selectedNodesIds, areNodesExpanded) => {
  return areNodesExpanded === false ||
    expandedNodesIds === undefined ||
    expandedNodesIds[0] === selectedNodesIds[0];
};

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  showLoaderAtInitialLoad: state.flows.initialDataLoading,
  showLoader: state.flows.linksLoading,
  showLoadedLinks: {
    _comparedValue: (state) => state.flows.links,
    _returnedValue: (state) => {
      return {
        links: state.flows.links,
        visibleNodes: state.flows.visibleNodes,
        visibleNodesByColumn: state.flows.visibleNodesByColumn,
        detailedView: state.flows.detailedView,
        selectedRecolorBy: state.flows.selectedRecolorBy,
        selectedNodesIds: state.flows.selectedNodesIds,
        shouldRepositionExpandButton: shouldRepositionExpandButton(state.flows.expandedNodesIds, state.flows.selectedNodesIds, state.flows.areNodesExpanded)
      };
    }
  },
  resizeViewport: {
    _comparedValue: (state) => state.app.windowSize,
    _returnedValue: (state) => {
      return {
        selectedNodesIds: state.flows.selectedNodesIds,
        shouldRepositionExpandButton: shouldRepositionExpandButton(state.flows.expandedNodesIds, state.flows.selectedNodesIds, state.flows.areNodesExpanded)
      };
    }
  },
  selectNodes: {
    _comparedValue: (state) => state.flows.selectedNodesIds,
    _returnedValue: (state) => {
      return {
        selectedNodesIds: state.flows.selectedNodesIds,
        shouldRepositionExpandButton: shouldRepositionExpandButton(state.flows.expandedNodesIds, state.flows.selectedNodesIds, state.flows.areNodesExpanded)
      };
    }
  },
  toggleExpandButton: state.flows.areNodesExpanded,
  highlightNodes: state.flows.highlightedNodesIds
});

// maps component callbacks (ie user events) to redux actions
// in the component, call this.callbacks.someMethod
// and from here return an object with keys = callback name (someMethod),
// and values = functions returning an action
const mapViewCallbacksToActions = () => ({
  onNodeClicked: (id, isAggregated) => selectNode(id, isAggregated),
  onNodeHighlighted: (id, isAggregated) => highlightNode(id, isAggregated),
  onExpandClick: () => toggleNodesExpand()
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
