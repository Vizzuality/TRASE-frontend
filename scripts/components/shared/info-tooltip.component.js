import TooltipTemplate from 'ejs!templates/shared/info-tooltip.ejs';
import 'styles/components/shared/info-tooltip.scss';

export default class {
  constructor(className) {
    this.infowindow = document.querySelector(className);
  }

  showTooltip(x, y, title, values) {
    this.infowindow.style.left = `${x}px`;
    this.infowindow.style.top = `${y}px`;

    const template = TooltipTemplate({ title, values });
    this.infowindow.innerHTML = template;
    this.infowindow.classList.remove('is-hidden');
  }

  hideTooltip() {
    this.infowindow.classList.add('is-hidden');
  }
}
