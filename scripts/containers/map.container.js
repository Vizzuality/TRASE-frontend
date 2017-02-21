// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId, highlightNodeFromGeoId } from 'actions/flows.actions';
import connect from 'connect';
import Map from 'components/map.component.js';

const mapMethodsToState = (state) => ({
  showLoadedMap: {
    _comparedValue: (state) => state.flows.mapVectorData,
    _returnedValue: (state) => {
      return {
        mapVectorData: state.flows.mapVectorData,
        currentPolygonType: state.flows.selectedColumnsIds[0],
        selectedNodesGeoIds: state.flows.selectedNodesGeoIds,
        recolourByNodeIds: state.flows.recolourByNodeIds
      };
    }
  },
  selectPolygonType: state.flows.selectedColumnsIds,
  selectPolygons: state.flows.selectedNodesGeoIds,
  highlightPolygon: state.flows.highlightedGeoIds,
  setChoropleth: state.flows.choropleth,
  loadContextLayers: state.flows.selectedMapContextualLayersData,
  showLinkedGeoIds: state.flows.linkedGeoIds
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: geoId => highlightNodeFromGeoId(geoId),
  onToggleMap: () => toggleMap(),
  onToggleMapLayerMenu: () => toggleMapLayerMenu()
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
