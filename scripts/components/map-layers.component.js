import 'styles/components/map/map-layers.scss';
import 'styles/components/shared/radio-btn.scss';
import 'styles/components/shared/switcher.scss';
import LayerTemplate from 'ejs!templates/layer.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.c-basemap-options');
    this.layerList = this.el.querySelector('.js-layer-list');

    this.loadLayers();
  }

  loadLayers() {
    const layers = [
      {
        name: 'test layer',
        id: 0,
        description: 'sgfuqdjsz fiudjm svxc'
      },
      {
        name: 'tessadsaddasdsat layer',
        id: 1,
        description: 'sgfuqdjsz fiudjm svxc'
      },
      {
        name: 'tsdadest layer',
        id: 3,
        description: 'sgfuqdjsz fsdiudjm svxc'
      }
    ];

    this.layerList.innerHTML = layers.map(layer => LayerTemplate(layer)).join('');

    this._setVars();
    this._setEventListeners();

  }

  selectVectorLayers(layers) {
    const mapVectorLayers =  {
      horizontal: layers.horizontal || null,
      vertical: layers.vertical || null
    };

    this._setActiveVectorLayers(mapVectorLayers);
  }

  selectContextualLayers(layers) {
    if (layers.length) {
      this._setActiveContextualLayers(layers);
    }
  }

  _setVars() {
    this.infoBtns     = this.layerList.querySelectorAll('.js-layer-info');
    this.downloadBtns = this.layerList.querySelectorAll('.js-layer-download');
    this.radios       = this.layerList.querySelectorAll('.c-radio-btn');

    this.contextualLayerList = this.el.querySelector('.js-layer-contextual');
    this.switchers  = this.contextualLayerList.querySelectorAll('.c-switcher');
  }

  _setEventListeners() {

    this.infoBtns.forEach((infoBtn) => {
      infoBtn.addEventListener('click', (e) => this._onInfo(e));
    });

    this.downloadBtns.forEach((downloadBtn) => {
      downloadBtn.addEventListener('click', (e) => this._onDownload(e));
    });

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
        if (radio.getAttribute('value') !== layers[group]['layerSlug']) return;
        const layerItem = radio.closest('.layer-item');
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;

        layerItem.classList.add('-selected');
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
        switcher.closest('.layer-item').classList.add('-selected');
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
    const title = this.layerList.querySelector(`.layer-item[data-layer-slug="${layerSlug}"]`)
      .querySelector('.layer-name').innerText;
    const currentSelectedRadio = this.layerList.querySelector('.c-radio-btn.-enabled');

    if (radio === currentSelectedRadio) {
      this._disableRadio(radio);
    } else {
      this._cleanRadiosByGroup(group);
    }

    this.callbacks.onVectorLayersSelected({
      direction: group, // 'vertical' or 'horizontal'
      title,
      layerSlug
    });
  }

  _onToggleSwitcher(e) {
    var switcher = e && e.currentTarget;
    if (!switcher) return;


    switcher.closest('.layer-item').classList.toggle('-selected');
    switcher.classList.toggle('-enabled');

    const layers = this._getActivelayers();
    this.callbacks.onContextualLayerSelected(layers);
  }

  _disableRadio(radio) {
    const layerItem = radio.closest('.layer-item');
    const partnerRadio = radio.nextElementSibling ?
      radio.nextElementSibling : radio.previousElementSibling;

    layerItem.classList.remove('-selected');
    radio.classList.remove('-enabled');
    partnerRadio.classList.remove('-disabled');
  }

  _cleanRadiosByGroup(group) {
    this.radios.forEach((radio) => {
      if (radio.getAttribute('data-group') === group
        && radio.classList.contains('-enabled')) {
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;
        const layerItem = radio.closest('.layer-item');


        layerItem.classList.remove('-selected');
        radio.classList.remove('-enabled');
        partnerRadio.classList.remove('-disabled');
      }
    });
  }


  // TODO: develop info function once is clear how it works
  _onInfo(e) {
    const target = e && e.currentTarget;
    const layerSlug = target.closest('.layer-item').getAttribute('data-layer-slug');

    console.info(`showing info of ${layerSlug}`);
  }

  // TODO: develop download function once is clear how it works
  _onDownload(e) {
    const target = e && e.currentTarget;
    const layerSlug = target.closest('.layer-item').getAttribute('data-layer-slug');

    console.info(`download of ${layerSlug}`);
  }
}
