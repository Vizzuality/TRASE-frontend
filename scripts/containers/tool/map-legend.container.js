import connect from 'connect';
import { toggleMapLayerMenu } from 'actions/app.actions';
import MapLegend from 'components/tool/map-legend.component';

const mapMethodsToState = () => ({
  updateChoroplethLegend: {
    _comparedValue: (state) => state.tool.selectedMapDimensions_,
    _returnedValue: (state) => {
      return {
        selectedMapDimensions: state.tool.selectedMapDimensions_,
        selectedMapContextualLayersData: state.tool.selectedMapContextualLayersData,
        mapDimensions: state.tool.mapDimensions
      };
    }
  },
  updateContextLegend: {
    _comparedValue: (state) => state.tool.selectedMapContextualLayersData,
    _returnedValue: (state) => {
      return {
        selectedMapDimensions: state.tool.selectedMapDimensions_,
        selectedMapContextualLayersData: state.tool.selectedMapContextualLayersData,
      };
    }
  }
});

const mapViewCallbacksToActions = () => ({
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(MapLegend, mapMethodsToState, mapViewCallbacksToActions);
