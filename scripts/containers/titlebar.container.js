import connect from 'connect';
import Titlebar from 'components/titlebar.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  selectNodes: state.flows.selectedNodesData,
  highlightNode: {
    _comparedValue: (state) => state.flows.highlightedNodeData,
    _returnedValue: (state) => {
      if (state.flows.highlightedNodeData.length === 0) {
        return state.flows.selectedNodesData.length > 0;
      }
      return state.flows.highlightedNodeData.length > 0;
    }
  }
});

export default connect(Titlebar, mapMethodsToState);
