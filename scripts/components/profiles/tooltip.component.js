import TooltipTemplate from 'ejs!templates/profiles/tooltip.ejs';
import 'styles/components/shared/infowindow.scss';

export default class {
  constructor(className) {
    this.el = document.querySelector(className);
  }

  showTooltip = (x, y, data) => {
    this.el.style.left = x + 'px';
    this.el.style.top = y + 'px';
    this.el.classList.remove('is-hidden');

    const template = TooltipTemplate({data: this.data, tabsTitle: this.tabsTitle, key: this.key});
    this.el.innerHTML = template;
  };

  hideTooltip = () => {
    this.el.classList.add('is-hidden');
  };
}
