import connect from 'connect';
import { selectVectorLayers, selectContextualLayers } from 'actions/flows.actions';
import mapLayers from 'components/map-layers.component';

const mapMethodsToState = (state) => ({
  selectedVectorLayers: state.flows.selectedVectorLayers,
  selectContextualLayers: state.flows.selectedContextualLayers
});

const mapViewCallbacksToActions = () => ({
  onVectorLayersSelected: layerData => selectVectorLayers(layerData),
  onContextualLayerSelected: layers => selectContextualLayers(layers)
});

export default connect(mapLayers, mapMethodsToState, mapViewCallbacksToActions);
