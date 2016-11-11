import _ from 'lodash';
import connect from 'connect';
import Search from 'components/search.component.js';
import { searchNode } from 'actions/flows.actions';

const mapMethodsToState = () => ({
  loadNodes: {
    _comparedValue: (state) => state.flows.nodesDict,
    _returnedValue: (state) => {
      return _.values(state.flows.nodesDict).filter(node => node.hasFlows === true && node.isAggregated !== true);
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onNodeSelected: id => searchNode(id),
});


export default connect(Search, mapMethodsToState, mapViewCallbacksToActions);
