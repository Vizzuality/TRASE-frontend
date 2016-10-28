import { selectNode, highlightNode, toggleNodesExpand } from 'actions/flows.actions';
import connect from 'connect';
import Sankey from 'components/sankey.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  initialDataLoadStarted: state.flows.initialDataLoading,
  linksLoadStarted: state.flows.linksLoading,
  linksLoaded: {
    _comparedValue: (state) => state.flows.links,
    _returnedValue: (state) => {
      return {
        links: state.flows.links,
        visibleNodes: state.flows.visibleNodes,
        visibleNodesByColumn: state.flows.visibleNodesByColumn,
      };
    }
  },
  resizeViewport: {
    _comparedValue: (state) => state.app.windowSize,
    _returnedValue: (state) => {
      // we don't actually need state.app.windowSize, because a CSS computed container size is used
      // but we do need selectedNodesIds, to place the expand buttons correctly
      return {
        selectedNodesIds: state.flows.selectedNodesIds,
        // we also need nodesExpanded to toggle expand button icon
        nodesExpanded: state.flows.nodesExpanded
      };
    }
  },
  selectNodes: {
    _comparedValue: (state) => state.flows.selectedNodesIds,
    _returnedValue: (state) => {
      return {
        selectedNodesIds: state.flows.selectedNodesIds,
        // we also need nodesExpanded to toggle expand button icon
        nodesExpanded: state.flows.nodesExpanded
      };
    }
  },
  highlightNodes: state.flows.highlightedNodesIds,
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
