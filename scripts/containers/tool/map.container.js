// see sankey.container for details on how to use those containers
import { toggleMap, toggleMapLayerMenu } from 'actions/app.actions';
import { selectNodeFromGeoId, highlightNodeFromGeoId, saveMapView } from 'actions/tool.actions';
import connect from 'connect';
import Map from 'components/tool/map.component.js';
import getBasemap from '../helpers/getBasemap';

const mapMethodsToState = (state) => ({
  setMapView: state.tool.mapView,
  showLoadedMap: {
    _comparedValue: (state) => state.tool.mapVectorData,
    _returnedValue: (state) => {
      return {
        mapVectorData: state.tool.mapVectorData,
        currentPolygonType: state.tool.selectedColumnsIds,
        selectedNodesGeoIds: state.tool.selectedNodesGeoIds,
        recolorByNodeIds: state.tool.recolorByNodeIds,
        choropleth: state.tool.choropleth,
        linkedGeoIds: state.tool.linkedGeoIds
      };
    }
  },
  selectPolygonType: {
    _comparedValue: (state) => state.tool.selectedColumnsIds ? state.tool.selectedColumnsIds[0] : undefined,
    _returnedValue: (state) => {
      return {
        selectedColumnsIds: state.tool.selectedColumnsIds,
        choropleth: state.tool.choropleth
      };
    }
  },
  selectPolygons:  {
    _comparedValue: (state) => state.tool.selectedNodesGeoIds,
    _returnedValue: (state) => {
      return {
        selectedGeoIds: state.tool.selectedNodesGeoIds
      };
    }
  },
  highlightPolygon:  {
    _comparedValue: (state) => state.tool.highlightedGeoIds,
    _returnedValue: (state) => {
      return {
        selectedGeoIds: state.tool.selectedNodesGeoIds,
        highlightedGeoId: state.tool.highlightedGeoIds[0]
      };
    }
  },
  setChoropleth: {
    _comparedValue: (state) => state.tool.choropleth,
    _returnedValue: (state) => {
      return {
        choropleth: state.tool.choropleth,
        linkedGeoIds: state.tool.linkedGeoIds,
        choroplethLegend: state.tool.choroplethLegend
      };
    }
  },
  loadContextLayers: state.tool.selectedMapContextualLayersData,
  showLinkedGeoIds: state.tool.linkedGeoIds,
  invalidate: state.tool.isMapVisible,
  setBasemap: {
    _comparedValue: (state) => getBasemap(state.tool),
    _returnedValue: (state) => getBasemap(state.tool)
  }
});

const mapViewCallbacksToActions = () => ({
  onPolygonClicked: geoId => selectNodeFromGeoId(geoId),
  onPolygonHighlighted: (geoId, coordinates) => highlightNodeFromGeoId(geoId, coordinates),
  onToggleMap: () => toggleMap(),
  onToggleMapLayerMenu: () => toggleMapLayerMenu(),
  onMoveEnd: (latlng, zoom) => saveMapView(latlng, zoom)
});

export default connect(Map, mapMethodsToState, mapViewCallbacksToActions);
