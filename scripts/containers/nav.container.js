// see sankey.container for details on how to use those containers
import connect from 'connect';
import { selectQuant, selectCountry } from 'actions/flows.actions';
import Nav from 'components/nav.component.js';

const mapMethodsToState = (state) => ({
  selectQuant: state.flows.selectedQuant,
  selectCountry: state.flows.selectedCountry
});

const mapViewCallbacksToActions = () => ({
  onQuantSelected: quant => selectQuant(quant),
  onCountrySelected: country => selectCountry(country)
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
