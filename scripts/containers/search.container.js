import connect from 'connect';
import Search from 'components/search.component.js';
import { searchNode } from 'actions/flows.actions';

const mapMethodsToState = (state) => ({
  loadNodes: state.flows.nodesDict
});

const mapViewCallbacksToActions = () => ({
  onNodeSelected: id => searchNode(id),
});


export default connect(Search, mapMethodsToState, mapViewCallbacksToActions);
