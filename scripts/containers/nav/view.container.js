import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectView } from 'actions/flows.actions';
import View from 'react-components/nav/view.component.js';
import loadTooltips from 'react-components/nav/loadTooltips.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    isDetailedView: state.flows.detailedView
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: () => {
      dispatch(toggleDropdown('view'));
    },
    onSelected: (view) => {
      dispatch(selectView(view));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(loadTooltips(View));
