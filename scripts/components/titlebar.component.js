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
    if (showTitles === true) {
      this.search.classList.add('is-hidden');
      this.nodesTitles.classList.remove('is-hidden');
    } else {
      this.search.classList.remove('is-hidden');
      this.nodesTitles.classList.add('is-hidden');
    }
  }
}
