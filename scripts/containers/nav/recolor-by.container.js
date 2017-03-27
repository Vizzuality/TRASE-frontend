import { connect } from 'preact-redux';
import { toggleDropdown } from 'actions/app.actions';
import { selectRecolorBy } from 'actions/flows.actions';
import loadTooltips from 'react-components/nav/loadTooltips.js';
import RecolorBy from 'react-components/nav/recolor-by.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    currentDropdown: state.app.currentDropdown,
    selectedRecolorBy: state.flows.selectedRecolorBy,
    recolorBys: state.flows.selectedContext.recolorBy
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onToggle: () => {
      dispatch(toggleDropdown('recolor-by'));
    },
    onSelected: (recolorBy) => {
      recolorBy.value = recolorBy.name;
      console.log(recolorBy)
      dispatch(selectRecolorBy(recolorBy));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(loadTooltips(RecolorBy));
