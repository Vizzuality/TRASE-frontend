import 'styles/components/shared/nav.scss';

export default class {
  onCreated() {
    this._setVars();
    this._setEventListeners();
  }
  _setVars() {
    this.el = document.querySelector('.c-nav');
    this.haveSolidBackground = false;
  }

  _setEventListeners() {
    document.addEventListener('scroll', () => this._checkBackground());
  }

  _checkBackground() {
    if (window.pageYOffset > 0 && !this.haveSolidBackground) {
      this.el.classList.add('-have-background');
      this.haveSolidBackground = true;
    } else if(window.pageYOffset <= 0 && this.haveSolidBackground) {
      this.el.classList.remove('-have-background');
      this.haveSolidBackground = false;
    }
  }
}
