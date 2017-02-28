// see sankey.container for details on how to use those containers
import connect from 'connect';
import { selectQuant, selectCountry, selectCommodity, selectBiomeFilter, selectYears, selectRecolorBy, selectView } from 'actions/flows.actions';
import Nav from 'components/nav.component.js';

const mapMethodsToState = (state) => ({
  selectQuant: state.flows.selectedQuant,
  selectCountry: state.flows.selectedCountry,
  selectCommodity: state.flows.selectedCommodity,
  selectBiomeFilter: state.flows.selectedBiomeFilter,
  selectYears: state.flows.selectedYears,
  selectRecolorBy: state.flows.selectedRecolorBy,
  updateNodeSelectionColors:  {
    _comparedValue: (state) => state.flows.recolorGroups,
    _returnedValue: (state) => {
      return (state.flows.selectedRecolorBy.value === undefined || state.flows.selectedRecolorBy.value === "none")
        // TODO state.flows.recolorGroups should probably be cleaned up of all undefined values in the state
        ? state.flows.recolorGroups.filter(c => c!== undefined)
        : null;
    }
  },
  selectView: state.flows.detailedView
});

const mapViewCallbacksToActions = () => ({
  onQuantSelected: quant => selectQuant(quant),
  onCountrySelected: country => selectCountry(country),
  onCommoditySelected: commodity => selectCommodity(commodity),
  onBiomeFilterSelected: biomeFilter => selectBiomeFilter(biomeFilter),
  onYearsSelected: years => selectYears(years),
  onRecolorBySelected: value => selectRecolorBy(value),
  onViewSelected: detailedView => selectView(detailedView === 'true')
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
