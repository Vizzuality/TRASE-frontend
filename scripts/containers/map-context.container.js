import connect from 'connect';
import { selectContextualLayers } from 'actions/flows.actions';
import mapContext from 'components/map-context.component';

const mapMethodsToState = (state) => ({
  buildLayers: state.flows.mapContextualLayers,
  selectContextualLayers: state.flows.selectedMapContextualLayers
});

const mapViewCallbacksToActions = () => ({
  onContextualLayerSelected: layers => selectContextualLayers(layers)
});

export default connect(mapContext, mapMethodsToState, mapViewCallbacksToActions);
