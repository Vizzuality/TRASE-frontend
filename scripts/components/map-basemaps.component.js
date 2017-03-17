import BasemapsTemplate from 'ejs!templates/map/map-basemaps.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-layer-basemaps');
  }

  buildBasemaps(basemaps) {
    this.el.innerHTML = BasemapsTemplate({ basemaps });

    this.radios = Array.prototype.slice.call(this.el.querySelectorAll('.c-radio-btn'), 0);
    this.radios.forEach((radio) => {
      radio.addEventListener('click', (e) => this._onToggleRadio(e));
    });
  }

  selectBasemap(basemapId) {
    this._setActiveBasemap(basemapId);
  }

  _setActiveBasemap(basemapId) {
    this.radios.forEach((radio) => {
      if (radio.getAttribute('value') !== basemapId) {
        return;
      }
      radio.classList.add('-enabled');
    });
  }

  _onToggleRadio(e) {
    const selectedRadio = e && e.currentTarget;
    if (!selectedRadio) {
      return;
    }

    const value = selectedRadio.getAttribute('value');
    const currentSelectedRadio = this.el.querySelector('.c-radio-btn.-enabled');

    if (selectedRadio === currentSelectedRadio) {
      return;
    }
    this.radios.forEach((radio) => {
      radio.classList.remove('-enabled');
    });

    this.callbacks.onMapBasemapSelected(value);
  }
}
