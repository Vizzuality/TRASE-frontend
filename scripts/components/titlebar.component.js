export default class {
  onCreated() {
    this.search = document.querySelector('.js-search-container');
    this.nodesTitles = document.querySelector('.js-nodes-titles-container');
  }
  toggle(selectedNodesData) {
    if (selectedNodesData.length === 0) {
      this.search.classList.remove('is-hidden');
      this.nodesTitles.classList.add('is-hidden');
    } else {
      this.search.classList.add('is-hidden');
      this.nodesTitles.classList.remove('is-hidden');
    }
  }
}
