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
    // console.log(geoData)
    var topoLayer = new L.GeoJSON();
    var keys = Object.keys(geoData.objects);
    keys.forEach(key => {
      console.log(key);
      const geojson = topojson.feature(geoData, geoData.objects[key]);
      topoLayer.addData(geojson);
    });
    topoLayer.addTo(this.map);
  }

  highlightNode(id) {
    this.id = id;
  }

  selectNode(id) {
    this.id = id;
  }
}
