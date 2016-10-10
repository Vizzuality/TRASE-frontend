import connect from 'connect';
import Titlebar from 'components/titlebar.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  toggle: state.flows.selectedNodesData
});

export default connect(Titlebar, mapMethodsToState);
