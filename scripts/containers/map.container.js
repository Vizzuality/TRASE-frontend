// see sankey.container for details on how to use those containers
import { toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId } from 'actions/flows.actions';
import connect from 'connect';
import Map from 'components/map.component.js';

const mapMethodsToState = (state) => ({
  highlightNode: state.flows.highlightedNodeId,
  selectNode: state.flows.selectedNodeId,
  selectVectorLayer: state.flows.selectedColumnsIds,
  loadMap: state.flows.geoData
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
