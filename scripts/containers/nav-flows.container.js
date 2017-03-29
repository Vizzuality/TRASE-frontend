import connect from 'connect';
import {
  selectView
} from 'actions/flows.actions';
import Nav from 'components/nav-flows.component.js';

const mapMethodsToState = (state) => ({
  addTooltips: state.app.tooltips,
  selectView: state.flows.detailedView
});

const mapViewCallbacksToActions = () => ({
  onViewSelected: detailedView => selectView(detailedView === 'true')
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
