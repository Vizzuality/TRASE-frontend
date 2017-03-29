import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectResizeBy } from 'actions/flows.actions';
import loadTooltips from 'react-components/nav/loadTooltips.js';
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
    onToggle: (id) => {
      dispatch(toggleDropdown(id));
    },
    onSelected: (resizeBy) => {
      dispatch(selectResizeBy(resizeBy));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(loadTooltips(ResizeBy));
