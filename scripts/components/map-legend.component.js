import { CHOROPLETH_CLASSES } from 'constants';
import LegendChoroTemplate from 'ejs!templates/map/legend-choro.ejs';
import LegendContextTemplate from 'ejs!templates/map/legend-context.ejs';
import 'style/components/map/map-legend.scss';
import abbreviateNumber from 'utils/abbreviateNumber';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-map-legend');
    this.el.addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
    this.choro = document.querySelector('.js-map-legend-choro');
    this.context = document.querySelector('.js-map-legend-context');
    this.map = document.querySelector('.c-map');
    this.attribution = document.querySelector('.js-map-attribution');
    this.mapControlScale = document.querySelector('.leaflet-control-scale');
    this.mapControlZoom = document.querySelector('.leaflet-control-zoom');
    this.mapControlSwitcher = document.querySelector('.js-basemap-switcher');

    const zoom = document.querySelector('.leaflet-control-zoom');
    const scale = document.querySelector('.leaflet-control-scale');
    zoom.addEventListener('mouseenter', () => { scale.classList.toggle('-visible', true); });
    zoom.addEventListener('mouseleave', () => { scale.classList.toggle('-visible', false); });
  }

  updateChoroplethLegend({selectedMapDimensions, selectedMapContextualLayersData}) {
    this._setupChoro(selectedMapDimensions, selectedMapContextualLayersData);
    this._updateMapControlsPosition();
  }

  updateContextLegend({selectedMapDimensions, selectedMapContextualLayersData}) {
    this._toggleLegend(selectedMapDimensions, selectedMapContextualLayersData);
    this._renderContext(selectedMapContextualLayersData);
    this._updateMapControlsPosition();
  }

  _setVars() {
    this.el = document.querySelector('.js-map-legend');
  }

  _setupChoro(vectorLayers, selectedMapContextualLayersData) {
    const horizontalLayer = vectorLayers['horizontal'];
    const verticalLayer = vectorLayers['vertical'];

    // Error handling
    if (horizontalLayer === 'undefined' && verticalLayer === 'undefined') {
      throw ('At least one selected layer has to have colour palette');
    }

    const settings = {
      isBidimensional: horizontalLayer.uid !== null && verticalLayer.uid !== null,
      horizontal: horizontalLayer.uid !== null ? horizontalLayer : null,
      vertical: verticalLayer.uid !== null ? verticalLayer : null
    };

    if (this.el.hasChildNodes()) {
      this._cleanChoro();
    }

    this._toggleLegend(vectorLayers, selectedMapContextualLayersData);

    if (!!settings.horizontal || !!settings.vertical) {
      this._renderChoro(settings);
    }
  }

  _toggleLegend(vectorLayers, selectedMapContextualLayersData) {
    if ( (vectorLayers && vectorLayers['horizontal'] && vectorLayers['horizontal'].uid) ||
         (vectorLayers && vectorLayers['vertical'] && vectorLayers['vertical'].uid) ||
         (selectedMapContextualLayersData && selectedMapContextualLayersData.length > 0)
       )
    {
      this._showLegend();
    } else {
      this._hideLegend();
    }

  }

  _showLegend() {
    this.el.classList.remove('-hidden');
    this.map.classList.add('-have-legend');
  }

  _hideLegend() {
    this.el.classList.add('-hidden');
    this.map.classList.remove('-have-legend');
  }

  _cleanChoro() {
    this.choro.innerHTML = '';
  }

  _renderChoro(settings) {
    let colors = CHOROPLETH_CLASSES['horizontal'];
    let title = [];
    let cssClass = '';
    let bucket = [];

    if (settings.isBidimensional) {
      colors = CHOROPLETH_CLASSES['bidimensional'];
      title = [settings.vertical.title, settings.horizontal.title];
      cssClass = '-bidimensional';
      bucket = [settings.vertical.bucket3, settings.horizontal.bucket3];
    } else if (settings.vertical) {
      colors = CHOROPLETH_CLASSES['vertical'];
      title = [settings.vertical.title, null];
      cssClass = '-vertical';
      bucket = settings.vertical.bucket5;
    } else {
      title = [null, settings.horizontal.title];
      cssClass = '-horizontal';
      bucket = settings.horizontal.bucket5;
    }

    const html = LegendChoroTemplate({
      title,
      colors,
      cssClass,
      bucket,
      isBidimensional: settings.isBidimensional,
      abbreviateNumber
    });

    if (!settings.horizontal && !settings.vertical) {
      this._cleanLegend();
      return;
    }

    this.choro.innerHTML = html;
  }

  _renderContext(layers) {
    const html = LegendContextTemplate({
      layers
    });
    this.context.innerHTML = html;
  }

  _updateMapControlsPosition() {
    const mapFooterHeight = this.el.offsetHeight + this.attribution.offsetHeight;
    this.mapControlSwitcher.style.bottom = `${mapFooterHeight + 8}px`;
    this.mapControlZoom.style.bottom = `${mapFooterHeight + 48}px`;
    this.mapControlScale.style.bottom = `${mapFooterHeight + this.mapControlScale.offsetHeight - 88}px`;
  }


}
