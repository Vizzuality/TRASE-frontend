import { selectNode, highlightNode } from 'actions/flows.actions';
import connect from 'connect';
import Sankey from 'components/sankey.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  dataUpdated: state.flows.payload,
  windowResized: state.app.windowSize,
  highlightNode: state.flows.highlightedNodeId,
  selectNode: state.flows.selectedNodeId
});

// maps component callbacks (ie user events) to redux actions
// in the component, call this.callbacks.someMethod
// and from here return an object with keys = callback name (someMethod),
// and values = functions returning an action
const mapViewCallbacksToActions = () => ({
  onNodeSelected: () => selectNode(),
  onNodeHighlighted: id => highlightNode(id)
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
