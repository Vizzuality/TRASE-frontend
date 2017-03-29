import Dropdown from 'components/dropdown.component';
import 'styles/components/shared/nav.scss';
import Tooltip from 'tether-tooltip';

export default class {
  onCreated() {
    this._setVars();
    this._setEventListeners();

    this.state = {
      visibilityAppMenu: false
    };

    this.viewDropdown = new Dropdown('view', this.callbacks.onViewSelected);

    this.setAppMenuVisibility();

  }

  addTooltips(tooltips) {
    new Tooltip({
      target: document.querySelector('.js-context-view svg'),
      content: tooltips.sankey.nav.view.main,
      classes: 'c-tooltip',
      position: 'top right'
    });
  }

  _setVars() {
    this.el = document.querySelector('.c-nav');

    this.AppNav = this.el.querySelector('.app-nav');
    this.FlowsNav = this.el.querySelector('.flows-nav');
    this.toggleBtn = this.el.querySelector('.js-toggle-menu');
  }

  _setEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.onToggleMenu());
  }

  onToggleMenu() {
    Object.assign(this.state, { visibilityAppMenu: !this.state.visibilityAppMenu });

    this.toggleBtn.querySelector('.burger').classList.toggle('open');
    this.setAppMenuVisibility();
  }

  setAppMenuVisibility() {
    this.AppNav.classList.toggle('is-hidden', !this.state.visibilityAppMenu);
    this.FlowsNav.classList.toggle('is-hidden', this.state.visibilityAppMenu);
  }

  selectView(value) {
    if (!this.viewDropdown) {
      return;
    }
    this.viewDropdown.selectValue(value);
  }
}
