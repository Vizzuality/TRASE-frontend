import stringToHTML from 'utils/stringToHTML';
import LayerTemplate from 'ejs!templates/basemap/layer.ejs';
import LayerContextualTemplate from 'ejs!templates/basemap/layer-contextual.ejs';

import 'styles/components/map/basemap-options.scss';
import 'styles/components/shared/radio-btn.scss';
import 'styles/components/shared/switcher.scss';

export default class {

  onCreated() {
    this.layers = [{
      slug: 'soy_trade_volume',
      name: 'soy trade volume'
    }, {
      slug: 'number_traders',
      name: 'number of traders'
    }, {
      slug: 'deforestation',
      name: 'deforestation'
    }, {
      slug: 'hdi',
      name: 'HDI'
    }, {
      slug: 'gdp',
      name: 'GDP'
    }];
    this.contextualLayers = [{
      slug: 'soy_infrastructure',
      name: 'soy infrastructure'
    }, {
      slug: 'protected_areas',
      name: 'protected areas'
    }, {
      slug: 'land_conflicts',
      name: 'land conflicts'
    }, {
      slug: 'forest_code_compliance',
      name: 'forest code compilance'
    }];

    console.log(this);

    this._setVars();
    this._populateLists();
  }
  selectContextualLayers(layers) {
    console.log('YIPPEEE', layers)
  }

  _setVars() {
    this.el = document.querySelector('.c-basemap-options');
    this.layerList = this.el.querySelector('.js-layer-list');
    this.contextualLayerList = this.el.querySelector('.js-layer-contextual');
  }

  _setEventListeners() {
    const switchers = this.contextualLayerList.querySelectorAll('.c-switcher');

    switchers.forEach((switcher) => {
      switcher.addEventListener('click', (e) => this._onToggleSwitcher(e));
    });
  }

  _populateLists () {
    this.layers.forEach((layer) => {
      const layerHTML = stringToHTML(LayerTemplate({
        slug: layer.slug,
        name: layer.name
      }));

      this.layerList.appendChild(layerHTML);
    });

    this.contextualLayers.forEach((layer) => {
      const layerHTML = stringToHTML(LayerContextualTemplate({
        slug: layer.slug,
        name: layer.name
      }));

      this.contextualLayerList.appendChild(layerHTML);
    });

    this._setEventListeners();
  }

  _selectedContextualLayer(layers) {
    console.log(layers);
  }

  _getActivelayers() {
    const switchers = this.contextualLayerList.querySelectorAll('.c-switcher.-enabled');
    const activeLayers = [];

    switchers.forEach((switcher) => {
      const layerSlug = switcher.getAttribute('data-layer-slug');
      activeLayers.push(layerSlug);
    });

    return activeLayers;
  }

  _onToggleSwitcher(e) {
    var switcher = e && e.currentTarget;
    if (!switcher) return;

    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();

    this.callbacks.onSelectedContextualLayer(layers);
  }

}
