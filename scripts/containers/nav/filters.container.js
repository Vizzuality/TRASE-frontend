import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectBiomeFilter } from 'actions/flows.actions';
import Filters from 'react-components/nav/filters.component.js';

const mapStateToProps = (state) => {
  return {
    currentDropdown: state.app.currentDropdown,
    selectedFilter: state.flows.selectedBiomeFilter,
    filters: state.flows.selectedContext.filterBy[0],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: () => {
      dispatch(toggleDropdown('filters'));
    },
    onSelected: (filterNode) => {
      dispatch(selectBiomeFilter(filterNode));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
