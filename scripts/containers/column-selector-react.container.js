import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectColumn } from 'actions/flows.actions';
import ColumnSelector from 'react-components/column-selector.component.js';

const mapStateToProps = (state) => {
  return {
    currentDropdown: state.app.currentDropdown,
    allColumns: state.flows.columns,
    selectedColumnsIds: state.flows.selectedColumnsIds
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onColumnSelected: (columnIndex, columnId) => {
      dispatch(selectColumn(columnIndex, columnId));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelector);
