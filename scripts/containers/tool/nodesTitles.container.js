import { selectNode } from 'actions/tool.actions';
import connect from 'connect';
import NodesTitles from 'components/tool/nodesTitles.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  selectNodes: {
    nodesData: state.tool.selectedNodesData,
    recolorGroups: state.tool.recolorGroups
  },
  highlightNode: {
    _comparedValue: (state) => state.tool.highlightedNodeData,
    _returnedValue: (state) => {
      return {
        nodesData: (state.tool.highlightedNodeData.length === 0) ? state.tool.selectedNodesData : state.tool.highlightedNodeData,
        isHighlight: state.tool.highlightedNodeData.length > 0,
        recolorGroups: state.tool.recolorGroups
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onCloseNodeClicked: (id) => selectNode(id)
});

export default connect(NodesTitles, mapMethodsToState, mapViewCallbacksToActions);
