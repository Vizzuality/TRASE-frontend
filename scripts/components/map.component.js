import L from 'leaflet';
import _ from 'lodash';
import 'leaflet.utfgrid';
import 'whatwg-fetch';
import * as topojson from 'topojson';
import { CARTO_BASE_URL } from 'constants';
import 'leaflet/dist/leaflet.css';
import 'style/components/map.scss';
import 'style/components/map/map-legend.scss';

export default class {
  constructor() {

    const mapOptions = {
      zoomControl: false
    };

    this.map = L.map('map', mapOptions).setView([-16, -50], 4);
    var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' });
    this.map.addLayer(basemap);

    this.map.createPane('main');
    this.map.getPane('main').style.zIndex = 600;
    this.map.createPane('context_above');
    this.map.getPane('context_above').style.zIndex = 601;

    this.contextLayers = [];

    this._setEventListeners();
  }

  _setEventListeners() {
    document.querySelector('.js-basemap-switcher').addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
    document.querySelector('.js-toggle-map').addEventListener('click', () => { this._onToggleMap(); });
  }

  loadMap(payload) {
    const geoData = payload.geoData;
    // TODO this statically maps vectorLayers indexes to column indexes, it should be dynamic
    this.vectorLayers = [
      this._getVectorLayer(geoData.biomes, 'map-polygon-biome'),
      this._getVectorLayer(geoData.states, 'map-polygon-state'),
      this._getVectorLayer(geoData.municipalities, 'map-polygon-logistics-hub'),
      this._getVectorLayer(geoData.municipalities, 'map-polygon-municipality')
    ];
    this.selectVectorLayer([payload.currentLayer]);
    if (payload.selectedNodesGeoIds) {
      this.selectPolygons(payload.selectedNodesGeoIds);
    }
  }

  selectPolygons(geoIds) {
    if (!this.currentLayer) {
      return;
    }
    const mapPolygons = Array.prototype.slice.call(document.querySelectorAll('.map-polygon'), 0);
    mapPolygons.forEach(e => { e.classList.remove('-selected'); });
    this.currentLayer.eachLayer(layer => {
      if (geoIds.indexOf(layer.feature.properties.geoid) > - 1) {
        layer._path.classList.add('-selected');
      }
    });
  }

  highlightPolygon(geoIds) {
    if (!this.currentLayer) {
      return;
    }

    if (this.highlightedLayer) this.map.removeLayer(this.highlightedLayer);

    if (geoIds.length > 0) {
      const geoId = geoIds[0];
      this.currentLayer.eachLayer(layer => {
        if (geoId === layer.feature.properties.geoid) {
          // polygon appears 'burried', and SVG does nto support z-indexes
          // so we have to recreate the hover layer on top of all other polygons
          this.highlightedLayer = L.geoJSON(layer.feature);
          this.highlightedLayer.setStyle(() => { return { className: 'map-polygon -highlighted'}; });
          this.map.addLayer(this.highlightedLayer);
        }
      });
    }
  }

  selectVectorLayer(columnIds) {
    if (!this.vectorLayers) return;
    const id = columnIds[0];
    this.vectorLayers.forEach((layer, i) => {
      if (id === i) {
        this.currentLayer = layer;
        this.map.addLayer(layer);
      } else {
        this.map.removeLayer(layer);
      }
    });
  }

  loadContextLayers(selectedMapContextualLayersData) {
    this.contextLayers.forEach(layer => {
      this.map.removeLayer(layer);
    });

    let forceZoom = 0;

    selectedMapContextualLayersData.forEach((layerData, i) => {
      if (layerData.rasterURL) {
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
    this.map.getPane('main').classList.toggle('-dimmed', selectedMapContextualLayersData.length > 0);

  }

  _createRasterLayer(layerData) {
    // const url = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png';
    const url = `${layerData.rasterURL}{z}/{x}/{y}.png`;
    var layer = L.tileLayer(url, {
      pane: 'context_above'
    });
    this.contextLayers.push(layer);
    this.map.addLayer(layer);
  }

  _createCartoLayer(layerData, i) {
    const baseUrl = `${CARTO_BASE_URL}${layerData.layergroupid}/0/{z}/{x}/{y}`;
    const layerUrl = `${baseUrl}.png`;
    // console.log(layerUrl)
    const layer = new L.tileLayer(layerUrl, {
      pane: 'context_above'
    });

    this.contextLayers.push(layer);
    this.map.addLayer(layer);

    if (i === 0) {
      const utfGridUrl = `${baseUrl}.grid.json?callback={cb}`;
      const utfGrid = new L.UtfGrid(utfGridUrl);

      this.contextLayers.push(utfGrid);
      this.map.addLayer(utfGrid, {
        resolution: 2
      });

      utfGrid.on('mouseover', function (e) {
        if (e.data && e.data.hasOwnProperty('cartodb_id')) {
          // console.log(e.data.cartodb_id);
        }
      });
    }
  }

  _getVectorLayer(geoData, polygonClassName) {
    var topoLayer = new L.GeoJSON(null, {
      pane: 'main'
    });
    var keys = Object.keys(geoData.objects);
    keys.forEach(key => {
      const geojson = topojson.feature(geoData, geoData.objects[key]);
      topoLayer.addData(geojson);
    });
    topoLayer.setStyle(() => { return { className: `${polygonClassName} map-polygon`}; });

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
          that.callbacks.onPolygonClicked(this.feature.properties.geoid);
        }
      });
    });
    return topoLayer;
  }

  _onToggleMap () {
    this.callbacks.onToggleMap();

    // recalculates map size once CSS transition ends
    setTimeout( () => {
      this.map.invalidateSize(true);
    }, 850);
  }

  setChoropleth(choropleth) {
    this.currentLayer.eachLayer(layer => {
      const choroItem = choropleth[layer.feature.properties.geoid];
      if (choroItem) {
        layer._path.style.fill = choroItem;
      } else {
        layer._path.style.fill = 'auto';
      }
    });
  }
}
