export default class {
  onCreated() {
    this.search = document.querySelector('.js-search');
    this.nodesTitles = document.querySelector('.js-nodes-titles');
  }
  toggle(selectedNodesIds) {
    if (selectedNodesIds.length === 0) {
      this.search.classList.remove('is-hidden');
      this.nodesTitles.classList.add('is-hidden');
    } else {
      this.search.classList.add('is-hidden');
      this.nodesTitles.classList.remove('is-hidden');
    }
  }
}
