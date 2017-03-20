import { selectColumn } from 'actions/flows.actions';
import connect from 'connect';
import ColumnsSelector from 'components/columns-selector.component.js';

const mapMethodsToState = (state) => ({
  buildColumns: {
    _comparedValue: (state) => state.flows.columns,
    _returnedValue: (state) => {
      return {
        sankeySize: state.app.sankeySize,
        columns: state.flows.columns,
        selectedColumnsIds: state.flows.selectedColumnsIds
      };
    }
  },
  selectColumns: state.flows.selectedColumnsIds,
  resize: state.app.sankeySize
});

const mapViewCallbacksToActions = () => ({
  onColumnSelected: (columnIndex, columnId) => selectColumn(columnIndex, columnId)
});

export default connect(ColumnsSelector, mapMethodsToState, mapViewCallbacksToActions);
