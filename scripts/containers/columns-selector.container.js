import { selectColumn } from 'actions/flows.actions';
import connect from 'connect';
import ColumnsSelector from 'components/columns-selector.component.js';

const mapMethodsToState = (state) => ({
  buildColumns: state.flows.columns,
  selectColumns: state.flows.selectedColumnsIds
});

const mapViewCallbacksToActions = () => ({
  onColumnSelected: (columnIndex, columnId) => selectColumn(columnIndex, columnId)
});

export default connect(ColumnsSelector, mapMethodsToState, mapViewCallbacksToActions);
