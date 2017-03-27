import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectResizeBy } from 'actions/flows.actions';
import loadTootlips from 'react-components/nav/loadTooltips.js';
import ResizeBy from 'react-components/nav/resize-by.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    selectedResizeBy: state.flows.selectedResizeBy,
    resizeBys: state.flows.selectedContext.resizeBy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: () => {
      dispatch(toggleDropdown('resize-by'));
    },
    onSelected: (resizeBy) => {
      dispatch(selectResizeBy(resizeBy));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(loadTootlips(ResizeBy));
