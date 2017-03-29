// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId, highlightNodeFromGeoId, saveMapView } from 'actions/flows.actions';
import connect from 'connect';
import Map from 'components/map.component.js';

const mapMethodsToState = (state) => ({
  setMapView: state.flows.mapView,
  showLoadedMap: {
    _comparedValue: (state) => state.flows.mapVectorData,
    _returnedValue: (state) => {
      return {
        mapVectorData: state.flows.mapVectorData,
        currentPolygonType: state.flows.selectedColumnsIds,
        selectedNodesGeoIds: state.flows.selectedNodesGeoIds,
        recolorByNodeIds: state.flows.recolorByNodeIds,
        choropleth: state.flows.choropleth,
        linkedGeoIds: state.flows.linkedGeoIds
      };
    }
  },
  selectPolygonType: state.flows.selectedColumnsIds,
  selectPolygons:  {
    _comparedValue: (state) => state.flows.selectedNodesGeoIds,
    _returnedValue: (state) => {
      return {
        selectedGeoIds: state.flows.selectedNodesGeoIds
      };
    }
  },
  highlightPolygon:  {
    _comparedValue: (state) => state.flows.highlightedGeoIds,
    _returnedValue: (state) => {
      return {
        selectedGeoIds: state.flows.selectedNodesGeoIds,
        highlightedGeoId: state.flows.highlightedGeoIds[0]
      };
    }
  },
  setChoropleth: {
    _comparedValue: (state) => state.flows.choropleth,
    _returnedValue: (state) => {
      return {
        choropleth: state.flows.choropleth,
        selectedNodesGeoIds: state.flows.selectedNodesGeoIds,
        linkedGeoIds: state.flows.linkedGeoIds,
        selectedMapDimensions: state.flows.selectedMapDimensions
      };
    }
  },
  loadContextLayers: state.flows.selectedMapContextualLayersData,
  loadBasemap: state.flows.selectedMapBasemap,
  showLinkedGeoIds: {
    _comparedValue: (state) => state.flows.linkedGeoIds,
    _returnedValue: (state) => {
      return {
        selectedNodesGeoIds: state.flows.selectedNodesGeoIds,
        linkedGeoIds: state.flows.linkedGeoIds
      };
    }
  },
  invalidate: state.flows.isMapVisible
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: geoId => highlightNodeFromGeoId(geoId),
  onToggleMap: () => toggleMap(),
  onToggleMapLayerMenu: () => toggleMapLayerMenu(),
  onMoveEnd: (latlng, zoom) => saveMapView(latlng, zoom)
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
