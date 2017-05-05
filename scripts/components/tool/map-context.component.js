import ContextLayersTemplate from 'ejs!templates/tool/map/map-context.ejs';
import 'styles/components/shared/switcher.scss';
import 'styles/components/tool/map/map-context.scss';
export default class {

  onCreated() {
    this.el = document.querySelector('.js-map-context');
    this.items = document.querySelector('.js-map-context-items');
  }

  buildLayers(layers) {
    this.items.innerHTML = ContextLayersTemplate({ layers });
    this.switchers = Array.prototype.slice.call(this.items.querySelectorAll('.c-switcher'), 0);

    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', (e) => this._onToggleSwitcher(e));
    });
  }

  selectContextualLayers(layers) {
    if (layers.length) {
      this._setActiveContextualLayers(layers);
    }
  }

  toggle(context) {
    this.el.classList.toggle('is-hidden', context.countryName !== 'BRAZIL');
  }

  _setActiveContextualLayers(layers) {
    layers.forEach((layerSlug) => {
      this.switchers.forEach((switcher) => {
        if (switcher.getAttribute('data-layer-slug') !== layerSlug) return;
        switcher.closest('.js-map-context-item').classList.add('-selected');
        switcher.classList.add('-enabled');
      });
    });
  }

  _onToggleSwitcher(e) {
    var switcher = e && e.currentTarget;
    if (!switcher) return;

    switcher.closest('.js-map-context-item').classList.toggle('-selected');
    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();
    this.callbacks.onContextualLayerSelected(layers);
  }

  _getActivelayers() {
    const activeLayers = [];

    this.switchers.forEach((switcher) => {
      if(!switcher.classList.contains('-enabled')) return;

      const layerSlug = switcher.getAttribute('data-layer-slug');
      activeLayers.push(layerSlug);
    });

    return activeLayers;
  }
}
