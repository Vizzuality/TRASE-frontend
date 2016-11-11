import connect from 'connect';
import { toggleMapLayerMenu } from 'actions/app.actions';
import MapLegend from 'components/map-legend.component';

const mapMethodsToState = () => ({
  selectVectorLayers: {
    _comparedValue: (state) => state.flows.selectedVectorLayers,
    _returnedValue: (state) => {
      return {
        selectedVectorLayers: state.flows.selectedVectorLayers,
        selectedMapContextualLayersData: state.flows.selectedMapContextualLayersData,
      };
    }
  },
  loadContextLayers: {
    _comparedValue: (state) => state.flows.selectedMapContextualLayersData,
    _returnedValue: (state) => {
      return {
        selectedVectorLayers: state.flows.selectedVectorLayers,
        selectedMapContextualLayersData: state.flows.selectedMapContextualLayersData,
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(MapLegend, mapMethodsToState, mapViewCallbacksToActions);
