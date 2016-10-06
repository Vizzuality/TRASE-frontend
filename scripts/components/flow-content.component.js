
export default class {

  onCreated() {
    this._setVars();
  }

  _setVars() {
    this.el = document.querySelector('.flow-content');
  }

  toggleMapLayersVisibility(isVisible) {
    if (isVisible) {
      this.el.classList.add('-open');
    } else {
      this.el.classList.remove('-open');
    }
  }
}
