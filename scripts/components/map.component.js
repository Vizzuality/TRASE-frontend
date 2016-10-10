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

  loadMap(geoData) {
    this.vectorLayers = [
      this._getVectorLayer(geoData.municipalities, 'map-polygon-municipality'),
      this._getVectorLayer(geoData.states, 'map-polygon-state'),
      this._getVectorLayer(geoData.biomes, 'map-polygon-biome')
    ];
    this.selectVectorLayer([geoData.currentLayer]);
  }

  selectPolygons(geoIds) {
    document.querySelectorAll('.map-polygon').forEach(e => { e.classList.remove('-selected'); });
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
          this._path.classList.add('-highlighted');
        },
        mouseout: function() {
          this._path.classList.remove('-highlighted');
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
}
