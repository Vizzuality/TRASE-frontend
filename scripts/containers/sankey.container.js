import { selectNode, highlightNode } from 'actions/flows.actions';
import connect from 'connect';
import Sankey from 'components/sankey.component.js';

// this maps component methods to app state updates
// keys correspond to method names, values to state prop path
const mapMethodsToState = (state) => ({
  linksLoaded: state.flows.linksPayload,
  windowResized: state.app.windowSize,
  highlightNode: state.flows.highlightedNodeId,
  selectNodes: state.flows.selectedNodesIds
});

// maps component callbacks (ie user events) to redux actions
// in the component, call this.callbacks.someMethod
// and from here return an object with keys = callback name (someMethod),
// and values = functions returning an action
const mapViewCallbacksToActions = () => ({
  onNodeClicked: id => selectNode(id),
  onNodeHighlighted: id => highlightNode(id)
});

export default connect(Sankey, mapMethodsToState, mapViewCallbacksToActions);
