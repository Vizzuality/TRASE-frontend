import _ from 'lodash';
import connect from 'connect';
import Search from 'components/search.component.js';
import { searchNode } from 'actions/flows.actions';

const mapMethodsToState = (state) => ({
  loadNodes: {
    _comparedValue: (state) => state.flows.nodesDict,
    _returnedValue: (state) => {
      return _.values(state.flows.nodesDict).filter(node => node.hasFlows === true && node.isAggregated !== true);
    }
  },
  loadEvents: state.flows.selectedContext
});

const mapViewCallbacksToActions = () => ({
  onNodeSelected: id => searchNode(parseInt(id, 10)),
});


export default connect(Search, mapMethodsToState, mapViewCallbacksToActions);
