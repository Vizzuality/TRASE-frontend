// see sankey.container for details on how to use those containers
// import _ from 'lodash';
import connect from 'connect';
import {
  // selectResizeBy, selectContext, selectBiomeFilter, selectYears, selectRecolorBy, selectView
} from 'actions/flows.actions';
import NavFlows from 'components/nav-flows-react-wrapper.component.js';

const mapMethodsToState = (/*state*/) => ({
  // renderContext: {
  //   _comparedValue: (state) => state.flows.selectedContext,
  //   _returnedValue: (state) => {
  //     return {
  //       contexts: state.flows.contexts,
  //       selectedContextId: state.flows.selectedContextId,
  //       tooltips: state.app.tooltips
  //     };
  //   }
  // },
  // addTooltips: state.app.tooltips,
  // selectContext: state.flows.selectedContext,
  // selectResizeBy: state.flows.selectedResizeBy,
  // selectBiomeFilter: state.flows.selectedBiomeFilter,
  // selectYears: state.flows.selectedYears,
  // selectRecolorBy: state.flows.selectedRecolorBy,
  // selectView: state.flows.detailedView,
  // updateNodeSelectionColors: {
  //   _comparedValue: (state) => state.flows.recolorGroups,
  //   _returnedValue: (state) => {
  //     return (state.flows.selectedRecolorBy === undefined || state.flows.selectedRecolorBy.name === 'none')
  //       // TODO state.flows.recolorGroups should probably be cleaned up of all undefined values in the state
  //       ? state.flows.recolorGroups.filter(c => c !== undefined) : null;
  //   }
  // },
});

const mapViewCallbacksToActions = () => ({
  // onContextSelected: context => selectContext(parseInt(context)),
  // onResizeBySelected: resizeBy => selectResizeBy(resizeBy),
  // onBiomeFilterSelected: biomeFilter => selectBiomeFilter(biomeFilter),
  // onYearsSelected: years => selectYears(years),
  // onRecolorBySelected: value => selectRecolorBy(value),
  // onViewSelected: detailedView => selectView(detailedView === 'true')
});

export default connect(NavFlows, mapMethodsToState, mapViewCallbacksToActions);
