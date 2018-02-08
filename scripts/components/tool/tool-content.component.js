export default class {

  onCreated() {
    this._setVars();

    this.onSankeyReset = this._resetSankey.bind(this);
  }

  _setVars() {
    this.el = document.querySelector('.js-tool-content');
    this.map = this.el.querySelector('.js-map-container');
    this.veil = this.el.querySelector('.js-sankey-veil');
    this.sankeyError = document.querySelector('.js-sankey-error');
    this.sankeyResetButton = document.querySelector('.js-sankey-reset');

    this.sankeyResetButton.addEventListener('click', this.onSankeyReset);
  }

  showLoaderAtInitialLoad(loading) {
    this._toggleLoading(loading);
  }

  _resetSankey() {
    this.callbacks.resetSankey();
  }

  showLoader(loading) {
    this._toggleLoading(loading);
  }

  _toggleLoading(loading) {
    document.querySelector('.js-tool-loading').classList.toggle('is-visible', loading);
  }

  toggleMapVisibility(isMapVisible) {
    this.el.classList.toggle('-center-map', isMapVisible);
    this.map.classList.toggle('-fullscreen', isMapVisible);
    this.veil.classList.toggle('is-hidden', !isMapVisible);
  }

  toggleMapLayersVisibility(isVisible) {
    this.el.classList.toggle('-open', isVisible);
  }

  toggleError(hasError) {
    this.sankeyError.classList.toggle('is-hidden', !hasError);
  }
}
