export default class {
  onCreated() {
    this.search = document.querySelector('.js-search-container');
    this.nodesTitles = document.querySelector('.js-nodes-titles-container');
  }

  highlightNode(showTitles) {
    this._toggle(showTitles);
  }

  selectNodes(selectedNodesData) {
    this._toggle(selectedNodesData.length > 0);
  }

  _toggle(showTitles) {
    this.search.classList.toggle('is-hidden', showTitles);
    this.nodesTitles.classList.toggle('is-hidden', !showTitles);
  }
}
