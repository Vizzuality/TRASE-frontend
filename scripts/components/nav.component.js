import Dropdown from 'components/dropdown.component';
// import BookmarkMenu from 'components/nav/bookmarks/bookmark-menu.component';
// import ShareMenu from 'components/nav/share/share-menu.component';
import YearsMenu from 'components/nav/years-brush/years-slider.component';
import 'styles/components/shared/nav.scss';

export default class {
  onCreated() {

    this._setVars();
    this._setEventListeners();

    this.state = {
      visibilityAppMenu: false
    };

    // left side
    this.countryDropdown = new Dropdown('country', this.callbacks.onCountrySelected);
    this.commodityDropdown = new Dropdown('commodity', this.callbacks.onCommoditySelected);
    this.biomeFilterDropdown = new Dropdown('biomeFilter', this.callbacks.onBiomeFilterSelected);

    this.yearsDropdown = new Dropdown('years', null);
    this.yearsMenu = new YearsMenu('js-years-slider', this.callbacks.onYearsSelected);

    // right side
    this.quantDropdown = new Dropdown('quant', this.callbacks.onQuantSelected);
    this.recolorByDropdown = new Dropdown('recolor-by', this.callbacks.onRecolorBySelected);
    this.viewDropdown = new Dropdown('view', this.callbacks.onViewSelected);


    // new BookmarkMenu();
    // new Dropdown('bookmark', this.callbacks.onQuantSelected);
    // new ShareMenu();
    // new Dropdown('share');

    this.setAppMenuVisibility();
  }

  _setVars() {
    this.el = document.querySelector('.c-nav');

    this.AppNav = this.el.querySelector('.app-nav');
    this.FlowsNav = this.el.querySelector('.flows-nav');
    this.toggleBtn = this.el.querySelector('.js-toggle-menu');
    this.logo = this.el.querySelector('.js-logo');
  }

  _setEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.onToggleMenu());
  }

  onToggleMenu() {
    Object.assign(this.state, {visibilityAppMenu: !this.state.visibilityAppMenu });

    this.toggleBtn.classList.toggle('open');
    this.setAppMenuVisibility();
  }

  setAppMenuVisibility() {
    this.AppNav.classList.toggle('is-hidden', !this.state.visibilityAppMenu);
    this.FlowsNav.classList.toggle('is-hidden', this.state.visibilityAppMenu);
    this.logo.classList.toggle('is-hidden', !this.state.visibilityAppMenu);
  }

  selectYears(years) {
    const title = (years[0] === years[1]) ? years[0] : years.join('&thinsp;-&thinsp;');
    this.yearsDropdown.setTitle(title);
    this.yearsMenu.setYears(years);
  }

  selectBiomeFilter(value) {
    this.biomeFilterDropdown.selectValue(value);
  }

  selectCountry(value) {
    this.countryDropdown.selectValue(value);
  }

  selectCommodity(value) {
    this.commodityDropdown.selectValue(value);
  }

  selectQuant(value) {
    this.quantDropdown.selectValue(value);
  }

  selectRecolorBy(data) {
    // TODO friday hack, this should not happen
    let value = data.value;
    if (value === undefined) {
      value = 'none';
    }

    const selectedRecolorByLegend = this.recolorByDropdown.el.querySelector(`[data-value="${value}"]`);
    const selectedRecolorByLegendItems = Array.prototype.slice.call(
      selectedRecolorByLegend.querySelectorAll('.js-dropdown-item-legend li'), 0);

    const legendItems = [];
    selectedRecolorByLegendItems.forEach(legend =>
      legendItems.push(legend.className)
    );
    this.recolorByDropdown.selectValue(data.value);

    // if (value === 'none') {
    //   this.recolorByDropdown.title.classList.add('-dimmed');
    // } else {
    //   this.recolorByDropdown.title.classList.remove('-dimmed');
    // }
  }

  selectedNodeColors(colors) {
    const legendContainer = document.querySelector('.js-dropdown-item-legend-summary');
    legendContainer.innerHTML = colors.map(color => `<div class="color -flow-${color}"></div>`).join('');
  }

  selectView(value) {
    this.viewDropdown.selectValue(value);
  }
}
