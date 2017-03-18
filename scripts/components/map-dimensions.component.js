import 'styles/components/map/map-layers.scss';
import 'styles/components/shared/radio-btn.scss';
import 'styles/components/shared/switcher.scss';
import MapDimensionsTemplate from 'ejs!templates/mapDimensions.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.c-basemap-options');
    this.layerList = this.el.querySelector('.js-layer-list');
  }

  loadMapDimensions(dimensionsByGroup) {
    this.mapDimensions = dimensionsByGroup;

    this.layerList.innerHTML = MapDimensionsTemplate({dimensionGroups: dimensionsByGroup});

    this._setVars();
    this._setEventListeners();
    this.callbacks.onMapDimensionsLoaded();
  }

  selectMapDimensions(dimensions) {
    const mapDimensions =  {
      horizontal: dimensions.horizontal || null,
      vertical: dimensions.vertical || null
    };

    this._setActiveMapDimensions(mapDimensions);
  }

  _setVars() {
    this.downloadBtns = Array.prototype.slice.call(this.layerList.querySelectorAll('.js-layer-download'), 0);
    this.radios       = Array.prototype.slice.call(this.layerList.querySelectorAll('.c-radio-btn'), 0);
  }

  _setEventListeners() {
    this.downloadBtns.forEach((downloadBtn) => {
      downloadBtn.addEventListener('click', (e) => this._onDownload(e));
    });

    this.radios.forEach((radio) => {
      radio.addEventListener('click', (e) => this._onToggleRadio(e));
    });
  }

  _setActiveMapDimensions(dimensions) {
    const directions = Object.keys(dimensions);

    directions.forEach((group) => {
      const radios = Array.prototype.slice.call(
        this.layerList.querySelectorAll(`.c-radio-btn[data-group="${group}"]`), 0);

      radios.forEach((radio) => {
        if (radio.getAttribute('value') !== dimensions[group]['uid']) return;
        const layerItem = radio.closest('.layer-item');
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;

        layerItem.classList.add('-selected');
        radio.classList.add('-enabled');
        partnerRadio.classList.add('-disabled');
      });
    });
  }

  _onToggleRadio(e) {
    const radio = e && e.currentTarget;
    if (!radio) return;

    const group = radio.getAttribute('data-group');
    const uid = radio.getAttribute('value');
    const title = this.layerList.querySelector(`.layer-item[data-layer-uid="${uid}"] .layer-name`).innerText;
    const currentSelectedRadio = this.layerList.querySelector('.c-radio-btn.-enabled');
    const bucket =  this.mapDimensions[0].dimensions.filter(dimension => {
      if (dimension.uid === uid){
        return dimension;
      }
    }).concat(
      this.mapDimensions[1].dimensions.filter(dimension => {
        if (dimension.uid === uid){
          return dimension;
        }
      })
    );

    if (radio === currentSelectedRadio) {
      this._disableRadio(radio);
    } else {
      this._cleanRadiosByGroup(group);
    }

    this.callbacks.onMapDimensionsSelected({
      direction: group, // 'vertical' or 'horizontal'
      title,
      uid,
      bucket3: bucket[0].bucket3,
      bucket5: bucket[0].bucket5
    });
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

  // TODO: develop download function once is clear how it works
  _onDownload() {
  }
}
