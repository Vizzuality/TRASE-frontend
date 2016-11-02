import connect from 'connect';
import Search from 'components/search.component.js';
import { selectNode } from 'actions/flows.actions';

const mapMethodsToState = (state) => ({
  loadNodes: state.flows.nodesDict
});

const mapViewCallbacksToActions = () => ({
  onNodeSelected: id => selectNode(id, false),
});


export default connect(Search, mapMethodsToState, mapViewCallbacksToActions);
