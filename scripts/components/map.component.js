import L from 'leaflet';
import 'leaflet.utfgrid';
import 'whatwg-fetch';
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

    const username = 'wri-01';
    const config = {'version': '1.0.1','layers':[{'user_name': 'wri-01','type': 'cartodb','options':{'sql':'SELECT * FROM ptw_grid_only_scoreover0','cartocss':'#layer{polygon-fill: #FF6600; polygon-opacity: 0.7; line-color: #FFF; line-width: 0; line-opacity:1;}','cartocss_version':'2.3.0','interactivity':['cartodb_id','grid_id']}}]};

    fetch(`https://wri-01.cartodb.com/api/v1/map?config=${encodeURIComponent(JSON.stringify(config))}`)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        function getUrl(format) {
          let url = 'https://' + username +
            '.cartodb.com/api/v1/map/' + data.layergroupid +
            '/0/{z}/{x}/{y}.' + format;

          if (format === 'grid.json') {
            return url + '?callback={cb}';
          }

          return url;
        }

        const layer = new L.tileLayer(getUrl('png'));
        const utfGrid = new L.UtfGrid(getUrl('grid.json'));

        this.map.addLayer(layer);
        this.map.addLayer(utfGrid, {
          resolution: 2
        });

        utfGrid.on('mouseover', function (e) {
          if (e.data && e.data.hasOwnProperty('grid_id')) {
            console.log(e.data.grid_id);
          }
        });
      });

    // $.ajax({
    //     url: 'https://wri-01.cartodb.com/api/v1/map',
    //     data: {
    //       config: decodeURIComponent(JSON.stringify(config))
    //     },
    //     success: (data) => { addLayer(data) }
    //   });



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
        layer._path.style.fill = 'none';
      }
    });
  }
}
