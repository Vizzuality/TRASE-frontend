import { LEGEND_COLORS } from 'constants';
import LegendChoroTemplate from 'ejs!templates/map/legend-choro.ejs';
import LegendContextTemplate from 'ejs!templates/map/legend-context.ejs';
import 'style/components/map/map-legend.scss';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-map-legend');
    this.el.addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
    this.choro = document.querySelector('.js-map-legend-choro');
    this.context = document.querySelector('.js-map-legend-context');
  }

  updateChoroplethLegend({selectedMapVariables, selectedMapContextualLayersData}) {
    this._setupChoro(selectedMapVariables, selectedMapContextualLayersData);
  }

  updateContextLegend({selectedMapVariables, selectedMapContextualLayersData}) {
    this._toggleLegend(selectedMapVariables, selectedMapContextualLayersData);
    this._renderContext(selectedMapContextualLayersData);
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
    this.el.classList.remove('is-hidden');
  }

  _hideLegend() {
    this.el.classList.add('is-hidden');
  }

  _cleanChoro() {
    this.choro.innerHTML = '';
  }

  _renderChoro(settings) {
    let colors = LEGEND_COLORS['horizontal'];
    let title = [];
    let cssClass = '';

    if (settings.isBidimensional) {
      colors = LEGEND_COLORS['bidimensional'];
      title = [settings.vertical.title, settings.horizontal.title];
      cssClass = '-bidimensional';
    } else if (settings.vertical) {
      colors = LEGEND_COLORS['vertical'];
      title = [settings.vertical.title, null];
      cssClass = '-vertical';
    } else {
      title = [null, settings.horizontal.title];
      cssClass = '-horizontal';
    }

    const html = LegendChoroTemplate({
      title,
      colors,
      cssClass,
      isBidimensional: settings.isBidimensional,
      isVertical: !settings.isBidimensional && settings.vertical
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
}
