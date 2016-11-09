export default class {
  onCreated() {
    this.button = document.querySelector('#clear-icon');
    this.text = document.querySelector('#clear-span');

    this.button.onclick = this.callbacks.onClearClick;
    this.text.onclick = this.callbacks.onClearClick;
  }
}
