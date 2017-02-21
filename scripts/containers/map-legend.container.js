import connect from 'connect';
import { toggleMapLayerMenu } from 'actions/app.actions';
import MapLegend from 'components/map-legend.component';

const mapMethodsToState = () => ({
  updateChoroplethLegend: {
    _comparedValue: (state) => state.flows.selectedMapVariables,
    _returnedValue: (state) => {
      return {
        selectedMapVariables: state.flows.selectedMapVariables,
        selectedMapContextualLayersData: state.flows.selectedMapContextualLayersData,
      };
    }
  },
  updateContextLegend: {
    _comparedValue: (state) => state.flows.selectedMapContextualLayersData,
    _returnedValue: (state) => {
      return {
        selectedMapVariables: state.flows.selectedMapVariables,
        selectedMapContextualLayersData: state.flows.selectedMapContextualLayersData,
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(MapLegend, mapMethodsToState, mapViewCallbacksToActions);
