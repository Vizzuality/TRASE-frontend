import connect from 'connect';
import {
  selectResizeBy, selectRecolorBy, selectView
} from 'actions/flows.actions';
import Nav from 'components/nav-flows.component.js';

const mapMethodsToState = (state) => ({
  renderContext: {
    _comparedValue: (state) => state.flows.selectedContext,
    _returnedValue: (state) => {
      return {
        contexts: state.flows.contexts,
        selectedContextId: state.flows.selectedContextId,
        tooltips: state.app.tooltips
      };
    }
  },
  addTooltips: state.app.tooltips,
  selectResizeBy: state.flows.selectedResizeBy,
  selectRecolorBy: state.flows.selectedRecolorBy,
  selectView: state.flows.detailedView,
  updateNodeSelectionColors: {
    _comparedValue: (state) => state.flows.recolorGroups,
    _returnedValue: (state) => {
      return (state.flows.selectedRecolorBy === undefined || state.flows.selectedRecolorBy.name === 'none')
        // TODO state.flows.recolorGroups should probably be cleaned up of all undefined values in the state
        ? state.flows.recolorGroups.filter(c => c !== undefined) : null;
    }
  },
});

const mapViewCallbacksToActions = () => ({
  onResizeBySelected: resizeBy => selectResizeBy(resizeBy),
  onRecolorBySelected: value => selectRecolorBy(value),
  onViewSelected: detailedView => selectView(detailedView === 'true')
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
