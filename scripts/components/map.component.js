import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'style/map.scss';

export default class {
  constructor() {
    this.map = L.map('map').setView([-16.20639, -44.43333], 4);
    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>' });
    this.map.addLayer(layer);
  }

  highlightNode(id) {
    this.id = id;
  }

  selectNode(id) {
    this.id = id;
  }
}
