export default class {

  onCreated() {
    this._setVars();
  }

  _setVars() {
    this.el = document.querySelector('.flow-content');
    this.map = this.el.querySelector('.c-map');
    this.veil = this.el.querySelector('.flow-veil');
  }

  toggleMapVisibility(isMapVisible) {
    if (isMapVisible) {
      this.el.classList.add('-center-map');
      this.map.classList.add('-fullscreen');
      this.veil.classList.remove('is-hidden');
    } else {
      this.el.classList.remove('-center-map');
      this.map.classList.remove('-fullscreen');
      this.veil.classList.add('is-hidden');
    }
  }

  toggleMapLayersVisibility(isVisible) {
    if (isVisible) {
      this.el.classList.add('-open');
    } else {
      this.el.classList.remove('-open');
    }
  }
}
