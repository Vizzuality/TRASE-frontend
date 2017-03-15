import Siema from 'siema';

export default class {

  constructor(settings) {
    this.options = Object.assign({}, settings);
    this.el = document.querySelector(this.options.selector);
    this.init();
  }

  init() {
    const { selector, perPage, next, prev } = this.options;
    this.slider = new Siema({ selector, perPage });
    if(next) this.el.querySelector(next).addEventListener('click', this.slider.next);
    if(prev) this.el.querySelector(prev).addEventListener('click', this.slider.prev);
  }

  destroy() {
    const { next, prev } = this.options;
    if(next) this.el.querySelector(next).removeEventListener('click', this.slider.next);
    if(prev) this.el.querySelector(prev).removeEventListener('click', this.slider.prev);
    this.slider.destroy();
  }
}
