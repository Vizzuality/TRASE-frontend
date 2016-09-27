import 'styles/components/map/map-layers.scss';
import 'styles/components/shared/radio-btn.scss';
import 'styles/components/shared/switcher.scss';

export default class {

  onCreated() {
    this._setVars();
    this._setEventListeners();
  }

  selectedVectorLayers(layers) {
    this.state = {
      mapVectorLayers: {
        horizontal: layers.horizontal || null,
        vertical: layers.vertical || null
      }
    };

    this._setActiveVectorLayers(this.state.mapVectorLayers);
  }

  selectContextualLayers(layers) {
    this.state.contextualLayers = layers;

    if (this.state.contextualLayers.length) {
      this._setActiveContextualLayers(this.state.contextualLayers);
    }
  }

  _setVars() {
    this.el = document.querySelector('.c-basemap-options');

    this.layerList = this.el.querySelector('.js-layer-list');
    this.radios = this.layerList.querySelectorAll('.c-radio-btn');

    this.contextualLayerList = this.el.querySelector('.js-layer-contextual');
    this.switchers = this.contextualLayerList.querySelectorAll('.c-switcher');
  }

  _setEventListeners() {
    this.radios.forEach((radio) => {
      radio.addEventListener('click', (e) => this._onToggleRadio(e));
    });

    this.switchers.forEach((switcher) => {
      switcher.addEventListener('click', (e) => this._onToggleSwitcher(e));
    });
  }

  // used for incoming params
  _setActiveVectorLayers(layers) {
    const groups = Object.keys(layers);

    groups.forEach((group) => {
      const radios = this.layerList.querySelectorAll(`.c-radio-btn[data-group="${group}"]`);
      radios.forEach((radio) => {
        if (radio.getAttribute('value') !== layers[group]) return;
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;

        radio.classList.add('-enabled');
        partnerRadio.classList.add('-disabled');
      });
    });
  }

  // used for incoming params
  _setActiveContextualLayers(layers) {
    layers.forEach((layerSlug) => {
      this.switchers.forEach((switcher) => {
        if (switcher.getAttribute('data-layer-slug') !== layerSlug) return;
        switcher.classList.add('-enabled');
      });
    });
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

  _onToggleRadio(e) {
    var radio = e && e.currentTarget;
    if (!radio) return;

    const group = radio.getAttribute('data-group');
    const layerSlug = radio.getAttribute('value');
    const currentSelectedRadio = this.layerList.querySelector('.c-radio-btn.-enabled');

    if (radio === currentSelectedRadio) {
      this._disableRadio(radio);
    } else {
      this._cleanRadiosByGroup(group);
    }

    this.state.mapVectorLayers[group] = this.state.mapVectorLayers[group] !== layerSlug ?
      layerSlug : null;

    this.callbacks.onSelectedVectorLayers(this.state.mapVectorLayers);
  }

  _onToggleSwitcher(e) {
    var switcher = e && e.currentTarget;
    if (!switcher) return;

    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();
    this.callbacks.onSelectedContextualLayer(layers);
  }

  _disableRadio(radio) {
    const partnerRadio = radio.nextElementSibling ?
      radio.nextElementSibling : radio.previousElementSibling;

    radio.classList.remove('-enabled');
    partnerRadio.classList.remove('-disabled');
  }

  _cleanRadiosByGroup(group) {
    this.radios.forEach((radio) => {
      if (radio.getAttribute('data-group') === group
        && radio.classList.contains('-enabled')) {
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;

        radio.classList.remove('-enabled');
        partnerRadio.classList.remove('-disabled');
      }
    });
  }
}
