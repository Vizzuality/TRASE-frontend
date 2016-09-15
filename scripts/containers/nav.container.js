// see sankey.container for details on how to use those containers
import connect from 'connect';
import { selectIndicator, selectCountry } from 'actions/flows.actions';
import Nav from 'components/nav.component.js';

const mapMethodsToState = (state) => ({
  selectIndicator: state.flows.selectedIndicator,
  selectCountry: state.flows.selectedCountry
});

const mapViewCallbacksToActions = () => ({
  onIndicatorSelected: indicator => selectIndicator(indicator),
  onCountrySelected: country => selectCountry(country)
});

export default connect(Nav, mapMethodsToState, mapViewCallbacksToActions);
