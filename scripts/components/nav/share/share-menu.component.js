import ShareTemplate from 'ejs!templates/share.ejs';
import 'styles/components/nav/share-dropdown.scss';

export default class {

  constructor() {
    this.el = document.querySelector('.js-share');
    this.dropdown = this.el.querySelector('.js-dropdown-list');
    this.isCopied = false;

    this.render();
    this._setVars();
    this._setListeners();
  }

  _setVars() {
    this.copyBtn = this.dropdown.querySelector('.js-clipboard-url');
    this.URLDisplay = this.dropdown.querySelector('.url-display');
  }

  _setListeners() {
    this.copyBtn.addEventListener('click', () => this._copyURL());
  }

  // añadir callback de error
  _copyURL() {
    const range = document.createRange();
    range.selectNode(this.URLDisplay);

    if (window.getSelection().rangeCount > 0) {
      window.getSelection().removeAllRanges();
    }

    window.getSelection().addRange(range);

    this.isCopied = document.execCommand('copy');

    if (this.isCopied) {
      this.copyBtn.innerText = 'Copied!';
    }
  }

  // changes button's literal
  _resetCopyButton() {
    if (!this.isCopied) {
      return;
    }

    this.copyBtn.innerText = 'Copy';
    this.isCopied = !this.isCopied;
  }

  // updates with new URL if it's different from
  // current one.
  _getURL() {
    const currentURL = this.URLDisplay.innerText;
    const newURL = window.location.href;

    if (currentURL !== newURL) {
      this.URLDisplay.innerText = newURL;
    }
  }

  onDropdownOpen() {
    this._getURL();
  }

  onDropdownClose() {
    this._resetCopyButton();
  }

  render() {
    this.dropdown.innerHTML = ShareTemplate();
  }
}
