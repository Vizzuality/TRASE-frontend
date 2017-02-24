import connect from 'connect';
import { selectMapLayer } from 'actions/flows.actions';
import { toggleModal } from 'actions/app.actions';
import MapLayers from 'components/map-layers.component.js';

const mapMethodsToState = (state) => ({
  loadMapLayers: {
    _comparedValue: (state) => state.flows.mapLayers,
    _returnedValue: (state) => {
      return state.flows.mapLayersFolders.map(layerGroup => {
        return {
          layerGroup,
          layers: state.flows.mapLayers.filter(layer => layer.groupId === layerGroup.id)
        };
      });
    }
  },
  selectMapLayers: state.flows.selectedMapLayers,
});

const mapViewCallbacksToActions = () => ({
  onMapLayersSelected: layerData => selectMapLayer(layerData),
  onToggleModal: (visibility, data) => toggleModal(visibility, data)
});

export default connect(MapLayers, mapMethodsToState, mapViewCallbacksToActions);
