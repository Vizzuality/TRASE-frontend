import connect from 'connect';
import { selectContextualLayers } from 'actions/tool.actions';
import mapContext from 'components/tool/map-context.component';

const mapMethodsToState = (state) => ({
  buildLayers: state.tool.mapContextualLayers,
  selectContextualLayers: state.tool.selectedMapContextualLayers,
  toggle: state.tool.selectedContext
});

const mapViewCallbacksToActions = () => ({
  onContextualLayerSelected: layers => selectContextualLayers(layers)
});

export default connect(mapContext, mapMethodsToState, mapViewCallbacksToActions);
