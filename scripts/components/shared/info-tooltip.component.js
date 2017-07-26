import _ from 'lodash';
import TooltipTemplate from 'ejs!templates/shared/info-tooltip.ejs';
import 'styles/components/shared/info-tooltip.scss';

export default class {
  constructor(className) {
    this.infowindow = document.querySelector(className);
    this.hide = _.debounce(this._hide, 100);
  }

  show(x, y, title, values) {
    this.hide.cancel();

    this.infowindow.style.left = `${x}px`;
    this.infowindow.style.top = `${y}px`;

    this.infowindow.innerHTML = TooltipTemplate({ title, values });
    this.infowindow.classList.remove('is-hidden');
  }

  _hide() {
    this.infowindow.classList.add('is-hidden');
  }
}
