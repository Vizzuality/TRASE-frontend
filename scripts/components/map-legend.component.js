
import { LEGEND_COLORS } from 'constants';
import stringToHTML from 'utils/stringToHTML';
import LegendTemplate from 'ejs!templates/map/legend.ejs';
import 'style/components/map/map-legend.scss';

export default class {

  onCreated() {
    this._setVars();
  }

  selectedVectorLayers(vectorLayers) {
    this.vectorLayers = vectorLayers;

    this._setupLegend();
  }

  _setVars() {
    this.el = document.querySelector('.js-map-legend');
    this.buckets = this.el.querySelector('.js-bucket-legend');
  }

  _setupLegend() {
    const horizontalLayer = this.vectorLayers['horizontal'];
    const verticalLayer = this.vectorLayers['vertical'];

    // Error handling
    if(horizontalLayer === 'undefined' && verticalLayer === 'undefined') {
      throw ('At least one selected layer has to have colour palette');
    }

    const settings = {
      isBidimensional: horizontalLayer.layerSlug && verticalLayer.layerSlug ? true : false,
      horizontal: horizontalLayer.layerSlug ? horizontalLayer : null,
      vertical: verticalLayer.layerSlug ? verticalLayer : null
    };

    if (this.buckets.hasChildNodes()) {
      this._cleanLegend();
    }

    this._renderLegend(settings);
  }

  _cleanLegend() {
    this.buckets.innerHTML = '';
  }

  _renderLegend(settings) {
    let colors = LEGEND_COLORS['horizontal'];
    let title = settings.vertical.title ? [settings.vertical.title] : [settings.horizontal.title];
    console.log(settings);

    if (settings.isBidimensional) {
      colors = LEGEND_COLORS['bidimensional'];
      title = [settings.vertical.title, settings.horizontal.title];
    } else if (settings.vertical) {
      colors = LEGEND_COLORS['vertical'];
    }

    const legendHTML = stringToHTML(LegendTemplate({
      title,
      colors,
      isBidimensional: settings.isBidimensional,
      isVertical: !settings.isBidimensional && settings.vertical
    }));

    if (!settings.horizontal && !settings.vertical) {
      this._cleanLegend();
      return;
    }

    for (var i = 0; i < legendHTML.length; i++) {
      this.buckets.appendChild(legendHTML[i].cloneNode(true));
    }
  }
}
