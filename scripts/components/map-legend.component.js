
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
    console.log('clean');
    this.buckets.innerHTML = '';
  }

  _renderLegend(settings) {
    let colors = LEGEND_COLORS['horizontal'];

    if (settings.isBidimensional) {
      colors = LEGEND_COLORS['bidimensional'];
    } else if (settings.vertical) {
      colors = LEGEND_COLORS['vertical'];
    }

    const legendHTML = stringToHTML(LegendTemplate({
      colors,
      isBidimensional: settings.isBidimensional,
      isVertical: !settings.isBidimensional && settings.vertical
    }));

    if (!settings.horizontal && !settings.vertical) {
      this._cleanLegend();
      return;
    }

    this.buckets.appendChild(legendHTML);


    // if (settings.isBidimensional) {
    //   const bucketsperRow = 3;
    //   const colors = LEGEND_COLORS['bidimensional'];
    //   let indexColor = 0;
    //
    //   for (let y = 0; y < bucketsperRow; y++) {
    //     const row = document.createElement('div');
    //     row.classList.add('row');
    //
    //     for (let x = 0; x < bucketsperRow; x++) {
    //       var bucket = document.createElement('div');
    //       bucket.classList.add('bucket');
    //       bucket.setAttribute('style', `background-color: ${colors[indexColor]}`);
    //       row.appendChild(bucket);
    //       this.buckets.appendChild(row);
    //       indexColor++;
    //     }
    //   }
    //   return;
    // }
    //
    // if (!settings.isBidimensional &&
    //   settings.vertical || settings.horizontal) {
    //
    //   const totalBuckets = 5;
    //   const colors = settings.vertical ? LEGEND_COLORS['vertical'] : LEGEND_COLORS['horizontal'];
    //   let indexColor = 0;
    //
    //   const row = document.createElement('div');
    //
    //   if (settings.vertical) {
    //     row.classList.add('row', '-vertical');
    //   } else {
    //     row.classList.add('row');
    //   }
    //
    //   for (let x = 0; x < totalBuckets; x++) {
    //     const bucket = document.createElement('div');
    //     bucket.classList.add('bucket');
    //     bucket.setAttribute('style', `background-color: ${colors[indexColor]}`);
    //     row.appendChild(bucket);
    //     indexColor++;
    //   }
    //
    //   this.buckets.appendChild(row);
    //
    //   return;
    // }
  }
}
