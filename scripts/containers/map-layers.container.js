import connect from 'connect';
import { selectVectorLayers } from 'actions/flows.actions';
import { toggleModal } from 'actions/app.actions';
import mapLayers from 'components/map-layers.component';

const mapMethodsToState = (state) => ({
  loadLayers: state.flows.mapLayers,
  selectVectorLayers: state.flows.selectedVectorLayers,
});

const mapViewCallbacksToActions = () => ({
  onVectorLayersSelected: layerData => selectVectorLayers(layerData),
  onToggleModal: (visibility, data) => toggleModal(visibility, data)
});

export default connect(mapLayers, mapMethodsToState, mapViewCallbacksToActions);
