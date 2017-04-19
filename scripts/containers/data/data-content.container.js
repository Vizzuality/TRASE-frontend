import connect from 'connect';
import { loadContextNodes } from 'actions/data.actions';
import dataContent from 'components/data/data-content.component';

const mapMethodsToState = (state) => ({
  fillContexts: state.data.contexts,
  fillExporters: state.data.exporters,
  fillConsumptionCountries: state.data.consumptionCountries,
  fillIndicators: state.data.indicators
});

const mapViewCallbacksToActions = () => ({
  onContextSelected: contextId => loadContextNodes(contextId),
});

export default connect(dataContent, mapMethodsToState, mapViewCallbacksToActions);
