
import { LEGEND_COLORS } from 'constants';
import stringToHTML from 'utils/stringToHTML';
import LegendTemplate from 'ejs!templates/map/legend.ejs';
import 'style/components/map/map-legend.scss';

export default class {

  onCreated() {
    this._setVars();
    this._setEventListeners();
  }

  selectedVectorLayers(vectorLayers) {
    this._setupLegend(vectorLayers);
  }

  _setVars() {
    this.el = document.querySelector('.js-map-legend');
  }

  _setEventListeners() {
    this.el.addEventListener('click', () => { this.callbacks.onToggleMapLayerMenu(); });
  }

  _setupLegend(vectorLayers) {
    const horizontalLayer = vectorLayers['horizontal'];
    const verticalLayer = vectorLayers['vertical'];

    // Error handling
    if(horizontalLayer === 'undefined' && verticalLayer === 'undefined') {
      throw ('At least one selected layer has to have colour palette');
    }

    const settings = {
      isBidimensional: horizontalLayer.layerSlug && verticalLayer.layerSlug ? true : false,
      horizontal: horizontalLayer.layerSlug ? horizontalLayer : null,
      vertical: verticalLayer.layerSlug ? verticalLayer : null
    };

    if (this.el.hasChildNodes()) {
      this._cleanLegend();
    }

    if (!!settings.horizontal || !!settings.vertical) {
      if (this.el.classList.contains('is-hidden')) {
        this._showLegend();
      }

      this._renderLegend(settings);
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

  _cleanLegend() {
    this.el.innerHTML = '';
  }

  _renderLegend(settings) {
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

    const legendHTML = stringToHTML(LegendTemplate({
      title,
      colors,
      cssClass,
      isBidimensional: settings.isBidimensional,
      isVertical: !settings.isBidimensional && settings.vertical
    }));

    if (!settings.horizontal && !settings.vertical) {
      this._cleanLegend();
      return;
    }

    for (var i = 0; i < legendHTML.length; i++) {
      this.el.appendChild(legendHTML[i].cloneNode(true));
    }
  }
}
