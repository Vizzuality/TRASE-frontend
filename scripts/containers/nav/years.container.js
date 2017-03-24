import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectYears } from 'actions/flows.actions';
import Years from 'react-components/nav/years.component.js';

const mapStateToProps = (state) => {
  return {
    currentDropdown: state.app.currentDropdown,
    selectedYears: state.flows.selectedYears,
    years: state.flows.selectedContext.years,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: () => {
      dispatch(toggleDropdown('years'));
    },
    onSelected: (years) => {
      dispatch(selectYears(years));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Years);
