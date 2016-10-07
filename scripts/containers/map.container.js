// see sankey.container for details on how to use those containers
import { toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId } from 'actions/flows.actions';
import connect from 'connect';
import Map from 'components/map.component.js';

const mapMethodsToState = (state) => ({
  loadMap: state.flows.geoData,
  selectVectorLayer: state.flows.selectedColumnsIds,
  selectPolygons: state.flows.selectedNodesGeoIds
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
