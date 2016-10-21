export default class {
  onCreated() {
    this.search = document.querySelector('.js-search-container');
    this.nodesTitles = document.querySelector('.js-nodes-titles-container');
  }

  highlightNode(highlightedNodeData) {
    this._toggle(highlightedNodeData);
  }

  selectNodes(selectedNodesData) {
    this._toggle(selectedNodesData);
  }

  _toggle(nodesData) {
    if (nodesData.length === 0) {
      this.search.classList.remove('is-hidden');
      this.nodesTitles.classList.add('is-hidden');
    } else {
      this.search.classList.add('is-hidden');
      this.nodesTitles.classList.remove('is-hidden');
    }
  }
}
