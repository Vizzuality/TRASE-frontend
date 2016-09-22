// see sankey.container for details on how to use those containers
import { selectNode, highlightNode } from 'actions/flows.actions';
import connect from 'connect';
import Map from 'components/map.component.js';

const mapMethodsToState = (state) => ({
  highlightNode: state.flows.highlightedNodeId,
  selectNode: state.flows.selectedNodeId,
  loadMap: state.flows.geoData
});

const mapViewCallbacksToActions = () => ({
  onNodeSelected: () => selectNode(),
  onNodeHighlighted: id => highlightNode(id)
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
