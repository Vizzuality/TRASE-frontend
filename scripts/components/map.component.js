import L from 'leaflet';
import * as topojson from 'topojson';
import 'leaflet/dist/leaflet.css';
import 'style/components/map.scss';
import 'style/components/map/map-legend.scss';

export default class {
  constructor() {
    this.map = L.map('map').setView([-16.20639, -44.43333], 4);
    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' });
    this.map.addLayer(layer);
  }

  loadMap(geoData) {
    this.vectorLayers = {
      municipalities: this._getVectorLayer(geoData.municipalities, 'map-polygon-municipality', true),
      states: this._getVectorLayer(geoData.states, 'map-polygon-state'),
      biomes: this._getVectorLayer(geoData.biomes, 'map-polygon-biome')
    };
  }

  highlightNode(id) {
    this.id = id;
  }

  selectNode(id) {
    this.id = id;
  }

  _getVectorLayer(geoData, polygonClassName, interactive = false) {
    var topoLayer = new L.GeoJSON();
    var keys = Object.keys(geoData.objects);
    keys.forEach(key => {
      const geojson = topojson.feature(geoData, geoData.objects[key]);
      topoLayer.addData(geojson);
    });
    topoLayer.addTo(this.map);
    topoLayer.eachLayer(layer => {
      const that = this;
      layer._path.classList.add(polygonClassName);
      layer._path.classList.add('map-polygon');
      if (interactive) {
        layer.on({
          mouseover: function() {
            this._path.classList.add('-highlighted');
          },
          mouseout: function() {
            this._path.classList.remove('-highlighted');
          },
          click: function() {
            // console.log(this.feature.properties.geoid);
            that.callbacks.onPolygonClicked(this.feature.properties.geoid);
          }
        });
      }
    });
  }
}
