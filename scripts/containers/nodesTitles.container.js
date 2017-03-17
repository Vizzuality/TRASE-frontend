import { selectNode } from 'actions/flows.actions';
import connect from 'connect';
import NodesTitles from 'components/nodesTitles.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  selectNodes: {
    nodesData: state.flows.selectedNodesData, recolorGroups: state.flows.recolorGroups
  }, highlightNode: {
    _comparedValue: (state) => state.flows.highlightedNodeData, _returnedValue: (state) => {
      return {
        nodesData: (state.flows.highlightedNodeData.length === 0) ? state.flows.selectedNodesData : state.flows.highlightedNodeData,
        isHighlight: state.flows.highlightedNodeData.length > 0,
        recolorGroups: state.flows.recolorGroups
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onCloseNodeClicked: (id) => selectNode(id)
});

export default connect(NodesTitles, mapMethodsToState, mapViewCallbacksToActions);
