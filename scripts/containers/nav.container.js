// see sankey.container for details on how to use those containers
import connect from 'connect';
import { selectIndicator } from 'actions/flows.actions';
import Nav from 'components/nav.component.js';

const mapMethodsToState = (state) => ({
  selectIndicator: state.flows.selectedIndicator
});

const mapViewCallbacksToActions = () => ({
  onIndicatorSelected: indicator => selectIndicator(indicator)
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
