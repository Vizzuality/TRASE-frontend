import L from 'leaflet';
import _ from 'lodash';
// import 'leaflet.utfgrid';
import turf_bbox from '@turf/bbox';
import { BASEMAPS, CARTO_BASE_URL, MAP_PANES, MAP_PANES_Z } from 'constants';
import 'leaflet/dist/leaflet.css';
import 'style/components/tool/map.scss';
import 'style/components/tool/map/map-legend.scss';

export default class {
  constructor() {

    const mapOptions = {
      zoomControl: false,
      minZoom: 2
    };

    this.map = L.map('js-map', mapOptions);
    new L.Control.Zoom({ position: 'bottomleft' }).addTo(this.map);
    L.control.scale({ position: 'bottomleft', imperial: false }).addTo(this.map);

    const worldBounds = L.latLngBounds(L.latLng(-89, -180), L.latLng(89, 180));
    this.map.setMaxBounds(worldBounds);
    this.map.on('drag', () => {
      this.map.panInsideBounds(worldBounds, { animate: false });
    });

    this.map.on('layeradd', () => this._updateAttribution());
    this.map.on('dragend zoomend', () => this.callbacks.onMoveEnd(this.map.getCenter(), this.map.getZoom()));
    this.map.on('zoomend', () => {
      const z = this.map.getZoom();
      this.map.getPane(MAP_PANES.vectorMain).classList.toggle('-high-zoom', z >= 6);
    });

    Object.keys(MAP_PANES).forEach(paneKey => {
      this.map.createPane(paneKey);
      this.map.getPane(paneKey).style.zIndex = MAP_PANES_Z[paneKey];
    });

    this.contextLayers = [];
    this.polygonFeaturesDict = {};

    document.querySelector('.js-basemap-switcher').addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
    document.querySelector('.js-toggle-map').addEventListener('click', () => { this.callbacks.onToggleMap(); });

    this.attribution = document.querySelector('.js-map-attribution');
    this.attributionSource = document.querySelector('.leaflet-control-attribution');
  }

  setMapView(mapView) {
    this.map.setView([mapView.latitude, mapView.longitude], mapView.zoom);
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
    this.polygonTypesLayers = {};

    // create geometry layers for all polygonTypes that have their own geometry
    Object.keys(mapVectorData).forEach(polygonTypeId => {
      const polygonType = mapVectorData[polygonTypeId];
      if (polygonType.useGeometryFromColumnId === undefined) {
        this.polygonTypesLayers[polygonTypeId] = this._getPolygonTypeLayer(
          polygonType.geoJSON,
          `map-polygon-${polygonType.name.toLowerCase()}`
        );
      }
    });

    // for polygonTypes that don't have their geometry, link to actual geometry layers
    Object.keys(mapVectorData).forEach(polygonTypeId => {
      const polygonType = mapVectorData[polygonTypeId];
      if (polygonType.useGeometryFromColumnId !== undefined) {
        this.polygonTypesLayers[polygonTypeId] = this.polygonTypesLayers[polygonType.useGeometryFromColumnId];
      }
    });

    this.selectPolygonType({ selectedColumnsIds: payload.currentPolygonType });
    if (payload.selectedNodesGeoIds) {
      this.selectPolygons({ selectedGeoIds: payload.selectedNodesGeoIds });
    }

    // under normal circumstances, choropleth (depends on loadNodes) and linkedGeoIds (depends on loadLinks)
    // are not available yet, but this is just a fail-safe for race conditions
    if (payload.choropleth) {
      this._setChoropleth(payload.choropleth);
    }
    if (payload.linkedGeoIds) {
      this.showLinkedGeoIds(payload.linkedGeoIds);
    }
  }

  selectPolygons(payload) {
    this._outlinePolygons(payload);
    if (this.vectorOutline !== undefined && payload.selectedGeoIds.length) {
      this.map.fitBounds(this.vectorOutline.getBounds());
    }
  }
  highlightPolygon(payload) { this._outlinePolygons(payload); }

  _outlinePolygons({ selectedGeoIds, highlightedGeoId }) {
    if (!this.currentPolygonTypeLayer || !selectedGeoIds) {
      return;
    }

    if (this.vectorOutline) {
      this.map.removeLayer(this.vectorOutline);
    }

    const selectedFeatures = selectedGeoIds.map(selectedGeoId => {
      if (!selectedGeoId) return;
      const originalPolygon = this.currentPolygonTypeLayer.getLayers().find(polygon => polygon.feature.properties.geoid === selectedGeoId);
      return originalPolygon.feature;
    });

    if (highlightedGeoId && selectedGeoIds.indexOf(highlightedGeoId) === -1) {
      const highlightedPolygon = this.currentPolygonTypeLayer.getLayers().find(polygon => polygon.feature.properties.geoid === highlightedGeoId);
      if (highlightedPolygon !== undefined) {
        selectedFeatures.push(highlightedPolygon.feature);
      } else {
        console.warn('no polygon found with geoId ', highlightedGeoId);
      }
    }

    if (selectedFeatures.length > 0) {
      this.vectorOutline = L.geoJSON(selectedFeatures, { pane: MAP_PANES.vectorOutline });
      this.vectorOutline.setStyle(feature => {
        return {
          className: (feature.properties.geoid === highlightedGeoId) ? '-highlighted' : '-selected'
        };
      });
      this.map.addLayer(this.vectorOutline);
    }
  }

  selectPolygonType({ selectedColumnsIds, choropleth }) {
    if (!this.polygonTypesLayers || !selectedColumnsIds.length) {
      return;
    }
    const id = selectedColumnsIds[0];
    if (this.currentPolygonTypeLayer) {
      this.map.removeLayer(this.currentPolygonTypeLayer);
    }

    this.currentPolygonTypeLayer = this.polygonTypesLayers[id];
    if (this.currentPolygonTypeLayer) {
      this.map.addLayer(this.currentPolygonTypeLayer);
      if (choropleth) {
        this._setChoropleth(choropleth);
      }
    }
  }

  loadContextLayers(selectedMapContextualLayersData) {
    this.contextLayers.forEach(layer => {
      this.map.removeLayer(layer);
    });

    let forceZoom = 0;
    // let hideMain = false;
    selectedMapContextualLayersData.forEach((layerData, i) => {
      const contextLayer = (layerData.rasterURL) ? this._createRasterLayer(layerData) : this._createCartoLayer(layerData, i);
      this.contextLayers.push(contextLayer);
      this.map.addLayer(contextLayer);

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
    // this.map.getPane(MAP_PANES.vectorMain).classList.toggle('-hidden', hideMain);

    this._updateAttribution();
  }

  _createRasterLayer(layerData) {
    const url = `${layerData.rasterURL}{z}/{x}/{y}.png`;

    // TODO add those params in layer configuration
    const southWest = L.latLng(-36, -76);
    const northEast = L.latLng(18, -28);
    const bounds = L.latLngBounds(southWest, northEast);

    const layer = L.tileLayer(url, {
      pane: MAP_PANES.contextBelow,
      tms: true,
      // TODO add those params in layer configuration
      maxZoom: 11,
      bounds
    });
    return layer;
  }

  _createCartoLayer(layerData /*, i */  ) {
    const baseUrl = `${CARTO_BASE_URL}${layerData.layergroupid}/{z}/{x}/{y}`;
    const layerUrl = `${baseUrl}.png`;
    const layer = new L.tileLayer(layerUrl, {
      pane: MAP_PANES.context
    });
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
    return layer;
  }

  _getPolygonTypeLayer(geoJSON) {
    var topoLayer = new L.GeoJSON(geoJSON, {
      pane: MAP_PANES.vectorMain,
      style: {
        smoothFactor: 0.9
      }
    });

    topoLayer.eachLayer(layer => {
      this.polygonFeaturesDict[layer.feature.properties.geoid] = layer;
      const that = this;
      layer.on({
        mouseover: function(event) {
          that.callbacks.onPolygonHighlighted(this.feature.properties.geoid, { pageX: event.originalEvent.pageX, pageY: event.originalEvent.pageY });
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


  setChoropleth({ choropleth, linkedGeoIds, choroplethLegend }) {
    if (!this.currentPolygonTypeLayer) {
      return;
    }
    this.map.getPane(MAP_PANES.vectorMain).classList.toggle('-noDimensions', choroplethLegend === null);
    this._setChoropleth(choropleth);
    if (linkedGeoIds && linkedGeoIds.length) {
      this.showLinkedGeoIds(linkedGeoIds);
    }
  }

  _setChoropleth(choropleth) {
    this.currentPolygonTypeLayer.eachLayer(layer => {
      const choroItem = choropleth[layer.feature.properties.geoid];
      const classNames = [];
      if (!layer.feature.properties.hasFlows) {
        classNames.push('-disabled');
      }
      classNames.push((choroItem) ? choroItem : 'ch-default');
      layer._path.setAttribute('class', classNames.join(' '));
      layer._path.setAttribute('geoid', layer.feature.properties.geoid);
    });

  }

  showLinkedGeoIds(linkedGeoIds) {
    if (!this.currentPolygonTypeLayer) {
      return;
    }

    const linkedPolygons = [];
    this.currentPolygonTypeLayer.eachLayer(layer => {
      const isLinked = linkedGeoIds.indexOf(layer.feature.properties.geoid) > -1;
      layer._path.classList.toggle('-linked', isLinked);
      if (isLinked) {
        linkedPolygons.push(layer.feature);
      }
    });

    if (linkedPolygons.length) {
      const bbox = turf_bbox({ 'type': 'FeatureCollection', 'features': linkedPolygons });
      this.map.fitBounds([[bbox[1], bbox[0]], [bbox[3], bbox[2]]], { padding: [0, 0] });
    }
  }

  _updateAttribution() {
    this.attribution.innerHTML = this.attributionSource.innerHTML;
  }

  invalidate () {
    // recalculates map size once CSS transition ends
    this.map.invalidateSize(true);
    setTimeout( () => {
      this.map.invalidateSize(true);
    }, 850);
  }
}
