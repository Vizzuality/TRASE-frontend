// see sankey.container for details on how to use those containers
import connect from 'connect';
import { selectQuant, selectCountry, selectCommodity, selectYears, selectColor, selectView } from 'actions/flows.actions';
import Nav from 'components/nav.component.js';

const mapMethodsToState = (state) => ({
  selectQuant: state.flows.selectedQuant,
  selectCountry: state.flows.selectedCountry,
  selectCommodity: state.flows.selectedCommodity,
  selectYears: state.flows.selectedYears,
  selectColor: state.flows.selectedColor,
  selectView: state.flows.selectedView
});

const mapViewCallbacksToActions = () => ({
  onQuantSelected: quant => selectQuant(quant),
  onCountrySelected: country => selectCountry(country),
  onCommoditySelected: commodity => selectCommodity(commodity),
  onYearsSelected: years => selectYears(years),
  onColorSelected: color => selectColor(color),
  onViewSelected: view => selectView(view)
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
