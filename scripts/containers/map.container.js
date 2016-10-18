// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId } from 'actions/flows.actions';
import connect from 'connect';
import Map from 'components/map.component.js';

const mapMethodsToState = (state) => ({
  loadMap: {
    _comparedValue: (state) => state.flows.geoData,
    _returnedValue: (state) => {
      return {
        geoData: state.flows.geoData,
        currentLayer: state.flows.selectedColumnsIds[0],
        selectedNodesGeoIds: state.flows.selectedNodesGeoIds
      };
    }
  },
  selectVectorLayer: state.flows.selectedColumnsIds,
  selectPolygons: state.flows.selectedNodesGeoIds,
  setChoropleth: state.flows.choropleth
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onToggleMap: () => toggleMap(),
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
