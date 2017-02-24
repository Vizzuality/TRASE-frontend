import connect from 'connect';
import { toggleMapLayerMenu } from 'actions/app.actions';
import MapLegend from 'components/map-legend.component';

const mapMethodsToState = () => ({
  updateChoroplethLegend: {
    _comparedValue: (state) => state.flows.selectedMapLayers,
    _returnedValue: (state) => {
      return {
        selectedMapLayers: state.flows.selectedMapLayers,
        selectedMapContextualLayersData: state.flows.selectedMapContextualLayersData,
      };
    }
  },
  updateContextLegend: {
    _comparedValue: (state) => state.flows.selectedMapContextualLayersData,
    _returnedValue: (state) => {
      return {
        selectedMapLayers: state.flows.selectedMapLayers,
        selectedMapContextualLayersData: state.flows.selectedMapContextualLayersData,
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(MapLegend, mapMethodsToState, mapViewCallbacksToActions);
