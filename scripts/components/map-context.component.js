import ContextLayersTemplate from 'ejs!templates/map/map-context.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-layer-contextual');

  }

  buildLayers(layers) {
    this.el.innerHTML = ContextLayersTemplate({ layers });
    this.switchers = Array.prototype.slice.call(this.el.querySelectorAll('.c-switcher'), 0);

    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', (e) => this._onToggleSwitcher(e));
    });
  }

  selectContextualLayers(layers) {
    if (layers.length) {
      this._setActiveContextualLayers(layers);
    }
  }

  _setActiveContextualLayers(layers) {
    layers.forEach((layerSlug) => {
      this.switchers.forEach((switcher) => {
        if (switcher.getAttribute('data-layer-slug') !== layerSlug) {
          return;
        }
        switcher.closest('.layer-item').classList.add('-selected');
        switcher.classList.add('-enabled');
      });
    });
  }

  _onToggleSwitcher(e) {
    var switcher = e && e.currentTarget;
    if (!switcher) {
      return;
    }

    switcher.closest('.layer-item').classList.toggle('-selected');
    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();
    this.callbacks.onContextualLayerSelected(layers);
  }

  _getActivelayers() {
    const activeLayers = [];

    this.switchers.forEach((switcher) => {
      if (!switcher.classList.contains('-enabled')) {
        return;
      }

      const layerSlug = switcher.getAttribute('data-layer-slug');
      activeLayers.push(layerSlug);
    });

    return activeLayers;
  }
}
