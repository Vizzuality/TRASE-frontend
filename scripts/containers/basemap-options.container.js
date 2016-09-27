import connect from 'connect';
import { selectLayers, selectContextualLayers } from 'actions/flows.actions';
import BasemapOptions from 'components/map/basemap-options.component';

const mapMethodsToState = (state) => ({
  selectedLayer: state.flows.selectedLayers,
  selectContextualLayers: state.flows.selectedContextualLayers
});

const mapViewCallbacksToActions = () => ({
  onSelectedLayer: layers => selectLayers(layers),
  onSelectedContextualLayer: layers => selectContextualLayers(layers)
});

export default connect(BasemapOptions, mapMethodsToState, mapViewCallbacksToActions);
