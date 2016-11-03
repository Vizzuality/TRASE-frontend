
export default class {

  onCreated() {
    this._setVars();


    // At some moment modal is invoked
    // this.callbacks.onToggleModal(true, {});
  }

  _setVars() {
    this.el = document.querySelector('.flow-content');
    this.map = this.el.querySelector('.c-map');
  }

  toggleMapVisibility(isMapVisible) {
    if (isMapVisible) {
      this.el.classList.add('-center-map');
      this.map.classList.add('-fullscreen');
    } else {
      this.el.classList.remove('-center-map');
      this.map.classList.remove('-fullscreen');
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
