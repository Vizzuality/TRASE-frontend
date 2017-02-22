import L from 'leaflet';
import _ from 'lodash';
import 'leaflet.utfgrid';
import { CARTO_BASE_URL, MAP_PANES, MAP_PANES_Z, BASEMAPS } from 'constants';
import 'leaflet/dist/leaflet.css';
import 'style/components/map.scss';
import 'style/components/map/map-legend.scss';

export default class {
  constructor() {

    const mapOptions = {
      zoomControl: false
    };

    this.map = L.map('map', mapOptions).setView([-16, -50], 4);
    new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map);

    Object.keys(MAP_PANES).forEach(paneKey => {
      this.map.createPane(paneKey);
      this.map.getPane(paneKey).style.zIndex = MAP_PANES_Z[paneKey];
    });

    this.loadBasemap('positron');

    this.contextLayers = [];

    document.querySelector('.js-basemap-switcher').addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
    document.querySelector('.js-toggle-map').addEventListener('click', () => { this._onToggleMap(); });
  }

  loadBasemap(basemapId) {
    if (this.basemap) {
      this.map.removeLayer(this.basemap);
    }
    if (this.basemapLabels) {
      this.map.removeLayer(this.basemapLabels);
    }

    const basemapOptions = BASEMAPS[basemapId];
    basemapOptions.pane = MAP_PANES.basemap;
    this.basemap = L.tileLayer(basemapOptions.url, basemapOptions);
    this.map.addLayer(this.basemap);

    if (basemapOptions.labelsUrl !== undefined) {
      basemapOptions.pane = MAP_PANES.basemapLabels;
      this.basemapLabels = L.tileLayer(basemapOptions.labelsUrl, basemapOptions);
      this.map.addLayer(this.basemapLabels);
    }
  }

  showLoadedMap(payload) {
    const mapVectorData = payload.mapVectorData;
    // TODO this statically maps polygonTypesLayers indexes to column indexes, it should be dynamic
    let municipalitiesLayer = this._getPolygonTypeLayer(mapVectorData.MUNICIPALITY, 'map-polygon-municipality');
    this.polygonTypesLayers = [
      this._getPolygonTypeLayer(mapVectorData.BIOME, 'map-polygon-biome'),
      this._getPolygonTypeLayer(mapVectorData.STATE, 'map-polygon-state'),
      municipalitiesLayer, // logistics hubs
      municipalitiesLayer // municipalities
    ];
    this.selectPolygonType([payload.currentPolygonType]);
    if (payload.selectedNodesGeoIds) {
      this.selectPolygons(payload.selectedNodesGeoIds);
    }
  }

  selectPolygons(geoIds) {
    this.selectedNodesLayer = this._paintPolygons(geoIds, this.selectedNodesLayer, '-selected');
  }

  showLinkedGeoIds(linkedGeoIds) {
    this.linkedLayer = this._paintPolygons(linkedGeoIds, this.linkedLayer, '-linked');
  }

  _paintPolygons(geoIds, targetLayer, className) {
    if (!this.currentPolygonTypeLayer) {
      return;
    }

    if (targetLayer) this.map.removeLayer(targetLayer);

    const selectedFeatures = [];
    this.currentPolygonTypeLayer.eachLayer(layer => {
      if (geoIds.indexOf(layer.feature.properties.geoid) > - 1) {
        selectedFeatures.push(layer.feature);
      }
    });

    // polygon appears 'burried', and SVG does nto support z-indexes
    // so we have to recreate the clicked layers on top of all other polygons
    let layer;
    if (selectedFeatures.length > 0) {
      layer = L.geoJSON(selectedFeatures, { pane: MAP_PANES.vectorMain });
      layer.setStyle(feature => this._getPolygonSyle(className, feature));
      this.map.addLayer(layer);
    }
    return layer;
  }

  // TODO use _paintPolygons
  highlightPolygon(geoIds) {
    if (!this.currentPolygonTypeLayer) {
      return;
    }

    if (this.highlightedLayer) this.map.removeLayer(this.highlightedLayer);

    if (geoIds.length > 0) {
      const geoId = geoIds[0];
      this.currentPolygonTypeLayer.eachLayer(layer => {
        if (geoId === layer.feature.properties.geoid) {
          // polygon appears 'burried', and SVG does nto support z-indexes
          // so we have to recreate the hover layer on top of all other polygons
          this.highlightedLayer = L.geoJSON(layer.feature, { pane: MAP_PANES.vectorMain });
          this.highlightedLayer.setStyle(feature => this._getPolygonSyle(null, feature, true));
          this.map.addLayer(this.highlightedLayer);
        }
      });
    }
  }

  selectPolygonType(columnIds) {
    if (!this.polygonTypesLayers) return;
    const id = columnIds[0];
    if (this.currentPolygonTypeLayer) {
      this.map.removeLayer(this.currentPolygonTypeLayer);
    }

    this.currentPolygonTypeLayer = this.polygonTypesLayers[id];
    this.map.addLayer(this.currentPolygonTypeLayer);
  }

  loadContextLayers(selectedMapContextualLayersData) {
    this.contextLayers.forEach(layer => {
      this.map.removeLayer(layer);
    });

    let forceZoom = 0;
    let hideMain = false;
    selectedMapContextualLayersData.forEach((layerData, i) => {
      if (layerData.rasterURL) {
        hideMain = true;
        this._createRasterLayer(layerData);
      } else {
        this._createCartoLayer(layerData, i);
      }

      if (_.isNumber(layerData.forceZoom)) {
        forceZoom = Math.max(layerData.forceZoom, forceZoom);
      }
    });

    if (forceZoom && this.map.getZoom() < forceZoom) {
      this.map.setZoom(forceZoom);
    }

    // disable main choropleth layer when there are context layers
    // we don't use addLayer/removeLayer because this causes a costly redrawing of the polygons
    this.map.getPane(MAP_PANES.vectorMain).classList.toggle('-dimmed', selectedMapContextualLayersData.length > 0);
    this.map.getPane(MAP_PANES.vectorMain).classList.toggle('-hidden', hideMain);
  }

  _createRasterLayer(layerData) {
    // const url = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
    const url = `${layerData.rasterURL}{z}/{x}/{y}.png`;

    // TODO add those params in layer configuration
    const southWest = L.latLng(-36, -76);
    const northEast = L.latLng(18, -28);
    const bounds = L.latLngBounds(southWest, northEast);

    var layer = L.tileLayer(url, {
      pane: MAP_PANES.context,
      tms: true,
      // TODO add those params in layer configuration
      maxZoom: 11,
      bounds
    });
    this.contextLayers.push(layer);
    this.map.addLayer(layer);
  }

  _createCartoLayer(layerData /*, i */  ) {
    const baseUrl = `${CARTO_BASE_URL}${layerData.layergroupid}/{z}/{x}/{y}`;
    const layerUrl = `${baseUrl}.png`;
    // console.log(layerUrl)
    const layer = new L.tileLayer(layerUrl, {
      pane: 'context_above'
    });

    this.contextLayers.push(layer);
    this.map.addLayer(layer);

    // TODO enable again and make it work
    // if (i === 0) {
    //   const utfGridUrl = `${baseUrl}.grid.json?callback={cb}`;
    //   const utfGrid = new L.UtfGrid(utfGridUrl);
    //
    //   this.contextLayers.push(utfGrid);
    //   this.map.addLayer(utfGrid, {
    //     resolution: 2
    //   });
    // }
  }

  _getPolygonTypeLayer(geoJSON, polygonClassName) {
    var topoLayer = new L.GeoJSON(geoJSON, { pane: MAP_PANES.vectorMain });

    topoLayer.setStyle(feature => this._getPolygonSyle(polygonClassName, feature));

    topoLayer.eachLayer(layer => {
      const that = this;
      layer.on({
        mouseover: function() {
          that.callbacks.onPolygonHighlighted(this.feature.properties.geoid);
        },
        mouseout: function() {
          that.callbacks.onPolygonHighlighted();
        },
        click: function() {
          if (this.feature.properties.hasFlows === true) {
            that.callbacks.onPolygonClicked(this.feature.properties.geoid);
          }
        }
      });
    });
    return topoLayer;
  }

  _getPolygonSyle(polygonClassName, feature, highlighted) {
    let classNames = ['map-polygon'];
    if (polygonClassName) {
      classNames.push(polygonClassName);
    }
    if (!feature.properties.hasFlows) {
      classNames.push('-disabled');
    }
    if (highlighted === true) {
      classNames.push('-highlighted');
    }
    return {className: classNames.join(' '), smoothFactor: 0.9};
  }

  _onToggleMap () {
    this.callbacks.onToggleMap();

    // recalculates map size once CSS transition ends
    setTimeout( () => {
      this.map.invalidateSize(true);
    }, 850);
  }

  setChoropleth(choropleth) {
    this.currentPolygonTypeLayer.eachLayer(layer => {
      const choroItem = choropleth[layer.feature.properties.geoid];
      // TODO use CSS classes instead
      if (choroItem) {
        layer._path.style.fill = choroItem;
      } else {
        layer._path.style.fill = '#c7c7c7';
      }
    });
  }


}
