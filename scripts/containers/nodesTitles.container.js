import connect from 'connect';
import NodesTitles from 'components/nodesTitles.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  update: state.flows.selectedNodesData
});

export default connect(NodesTitles, mapMethodsToState);
