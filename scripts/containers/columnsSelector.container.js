import { selectColumn } from 'actions/flows.actions';
import connect from 'connect';
import ColumnsSelector from 'components/columnsSelector.component.js';

const mapMethodsToState = (state) => ({
  columnsLoaded: state.flows.columns
});

const mapViewCallbacksToActions = () => ({
  onColumnClicked: id => selectColumn(id)
});

export default connect(ColumnsSelector, mapMethodsToState, mapViewCallbacksToActions);
