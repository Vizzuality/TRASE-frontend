import { selectNode, highlightNode, toggleNodesExpand, resetState } from 'actions/tool.actions';
import connect from 'connect';
import Sankey from 'components/tool/sankey.component.js';

const shouldRepositionExpandButton = (expandedNodesIds, selectedNodesIds, areNodesExpanded) => {
  return areNodesExpanded === false ||
    expandedNodesIds === undefined ||
    expandedNodesIds[0] === selectedNodesIds[0];
};

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  showLoaderAtInitialLoad: state.tool.initialDataLoading,
  showLoader: state.tool.linksLoading,
  showLoadedLinks: {
    _comparedValue: (state) => state.tool.links,
    _returnedValue: (state) => {
      return {
        sankeySize: state.app.sankeySize,
        links: state.tool.links,
        visibleNodes: state.tool.visibleNodes,
        visibleNodesByColumn: state.tool.visibleNodesByColumn,
        detailedView: state.tool.detailedView,
        selectedRecolorBy: state.tool.selectedRecolorBy,
        selectedNodesIds: state.tool.selectedNodesIds,
        shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool.expandedNodesIds, state.tool.selectedNodesIds, state.tool.areNodesExpanded)
      };
    }
  },
  resizeViewport: {
    _comparedValue: (state) => state.app.sankeySize,
    _returnedValue: (state) => {
      return {
        sankeySize: state.app.sankeySize,
        selectedRecolorBy: state.tool.selectedRecolorBy,
        selectedNodesIds: state.tool.selectedNodesIds,
        shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool.expandedNodesIds, state.tool.selectedNodesIds, state.tool.areNodesExpanded)
      };
    }
  },
  selectNodes: {
    _comparedValue: (state) => state.tool.selectedNodesIds,
    _returnedValue: (state) => {
      return {
        selectedNodesIds: state.tool.selectedNodesIds,
        shouldRepositionExpandButton: shouldRepositionExpandButton(state.tool.expandedNodesIds, state.tool.selectedNodesIds, state.tool.areNodesExpanded)
      };
    }
  },
  toggleExpandButton: state.tool.areNodesExpanded,
  highlightNodes: state.tool.highlightedNodesIds
});

// maps component callbacks (ie user events) to redux actions
// in the component, call this.callbacks.someMethod
// and from here return an object with keys = callback name (someMethod),
// and values = functions returning an action
const mapViewCallbacksToActions = () => ({
  onNodeClicked: (id, isAggregated) => selectNode(id, isAggregated),
  onNodeHighlighted: (id, isAggregated) => highlightNode(id, isAggregated),
  onExpandClick: () => toggleNodesExpand(),
  onClearClick: () => resetState()
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
