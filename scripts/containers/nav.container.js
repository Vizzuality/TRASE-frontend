// see sankey.container for details on how to use those containers
// import _ from 'lodash';
import connect from 'connect';
import {
  selectResizeBy, selectContext, selectBiomeFilter, selectYears, selectRecolorBy, selectView
} from 'actions/flows.actions';
import Nav from 'components/nav.component.js';

const mapMethodsToState = (state) => ({
  render: {
    _comparedValue: (state) => state.flows.selectedContext,
    _returnedValue: (state) => {
      return {
        contexts: state.flows.contexts, selectedContextId: state.flows.selectedContextId
      };
    }
  },
  selectContext: state.flows.selectedContext,
  selectResizeBy: {
    _comparedValue: (state) => ({
      selectedCommodityId: state.flows.selectedResizeBy,
      selectedContextId: state.flows.selectedContextId
    }), _returnedValue: (state) => state.flows.selectedResizeBy
  },
  selectBiomeFilter: {
    _comparedValue: (state) => ({
      selectedCommodityId: state.flows.selectedBiomeFilter,
      selectedContextId: state.flows.selectedContextId
    }), _returnedValue: (state) => state.flows.selectedBiomeFilter
  },
  selectYears: {
    _comparedValue: (state) => ({
      selectedCommodityId: state.flows.selectedYears,
      selectedContextId: state.flows.selectedContextId
    }), _returnedValue: (state) => state.flows.selectedYears
  },
  selectRecolorBy: {
    _comparedValue: (state) => ({
      selectedCommodityId: state.flows.selectedRecolorBy,
      selectedContextId: state.flows.selectedContextId
    }), _returnedValue: (state) => state.flows.selectedRecolorBy
  },
  updateNodeSelectionColors: {
    _comparedValue: (state) => state.flows.recolorGroups, _returnedValue: (state) => {
      return (state.flows.selectedRecolorBy === undefined || state.flows.selectedRecolorBy.value === undefined || state.flows.selectedRecolorBy.value === 'none')
        // TODO state.flows.recolorGroups should probably be cleaned up of all undefined values in the state
        ? state.flows.recolorGroups.filter(c => c !== undefined) : null;
    }
  },
  selectView: {
    _comparedValue: (state) => ({
      selectedCommodityId: state.flows.detailedView,
      selectedContextId: state.flows.selectedContextId
    }), _returnedValue: (state) => state.flows.detailedView
  },
});

const mapViewCallbacksToActions = () => ({
  onContextSelected: context => selectContext(parseInt(context)),
  onResizeBySelected: resizeBy => selectResizeBy(resizeBy),
  onBiomeFilterSelected: biomeFilter => selectBiomeFilter(biomeFilter),
  onYearsSelected: years => selectYears(years),
  onRecolorBySelected: value => selectRecolorBy(value),
  onViewSelected: detailedView => selectView(detailedView === 'true')
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
