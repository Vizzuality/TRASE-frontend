import L from 'leaflet';
import * as topojson from 'topojson';
import 'leaflet/dist/leaflet.css';
import 'style/components/map.scss';
import 'style/components/map/map-legend.scss';

export default class {
  constructor() {

    const mapOptions = {
      zoomControl: false
    };

    this.map = L.map('map', mapOptions).setView([-16.20639, -44.43333], 4);
    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' });
    this.map.addLayer(layer);

    this._setEventListeners();
  }

  _setEventListeners() {
    document.querySelector('.js-basemap-switcher').addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
    document.querySelector('.js-toggle-map').addEventListener('click', () => { this._onToggleMap(); });
  }

  loadMap(payload) {
    const geoData = payload.geoData;
    this.vectorLayers = [
      this._getVectorLayer(geoData.biomes, 'map-polygon-biome'),
      this._getVectorLayer(geoData.states, 'map-polygon-state'),
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

  _getVectorLayer(geoData, polygonClassName) {
    var topoLayer = new L.GeoJSON();
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
          // polygon appears 'burried', and SVG does nto support z-indexes
          // so we have to recreate the hover layer on top of all other polygons
          if (that.highlightedLayer) that.map.removeLayer(that.highlightedLayer);
          that.highlightedLayer = L.geoJSON(this.feature);
          that.highlightedLayer.setStyle(() => { return { className: 'map-polygon -highlighted'}; });
          that.map.addLayer(that.highlightedLayer);
        },
        mouseout: function() {
          if (that.highlightedLayer) that.map.removeLayer(that.highlightedLayer);
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
        layer._path.style.fill = 'none';
      }
    });
  }
}
