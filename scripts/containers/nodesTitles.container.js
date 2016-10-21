import connect from 'connect';
import NodesTitles from 'components/nodesTitles.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  selectNodes: state.flows.selectedNodesData,
  highlightNode: {
    _comparedValue: (state) => state.flows.highlightedNodeData,
    _returnedValue: (state) => (state.flows.highlightedNodeData.length === 0) ? state.flows.selectedNodesData : state.flows.highlightedNodeData
  }
});

export default connect(NodesTitles, mapMethodsToState);
