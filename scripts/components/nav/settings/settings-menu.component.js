import 'styles/components/nav/settings-dropdown.scss';
import SettingsTemplate from 'ejs!templates/settings.ejs';

export default class {

  constructor() {
    this.el = document.querySelector('.js-settings');
    this.dropdown = this.el.querySelector('.js-dropdown');

    this.render();

    this._setvars();
    this._setEventListeners();

    this._close();
  }

  _setEventListeners() {
    this.el.addEventListener('mouseenter', () => this._open());
    this.el.addEventListener('mouseleave', () => this._close());
    this.switcher.addEventListener('click', () => this._toggleSwitcher());
    this.modes.forEach((mode) => mode.addEventListener('click', (e) => this._selectMode(e)));
    this.cols.forEach((col) => col.addEventListener('click', (e) => this._selectColumn(e)));
  }

  _selectMode(e) {
    this._cleanModes();
    e.currentTarget.classList.add('-selected');
  }

  _cleanModes() {
    this.modes.forEach((mode) => mode.classList.remove('-selected'));
  }

  _selectColumn(e) {
    this._cleanColumns();
    e.currentTarget.classList.add('-selected');
  }

  _cleanColumns() {
    this.cols.forEach((col) => col.classList.remove('-selected'));
  }

  _toggleSwitcher() {
    this.switcher.classList.toggle('-enabled');
  }

  _setvars() {
    this.switcher = this.el.querySelector('.c-switcher');
    this.cols = this.el.querySelectorAll('.column');
    this.modes = this.el.querySelectorAll('.graph-mode');
  }

  _open() {
    this.dropdown.classList.remove('is-hidden');
  }

  _close() {
    this.dropdown.classList.add('is-hidden');
  }

  render() {
    this.dropdown.innerHTML = SettingsTemplate();
  }
}
