import 'styles/components/nav.scss';
import Dropdown from 'components/dropdown.component';
import BookmarkMenu from 'components/nav/bookmarks/bookmark-menu.component';
import ShareMenu from 'components/nav/share/share-menu.component';
import YearsMenu from 'components/nav/years-brush/years-slider.component';

export default class {
  onCreated() {

    // left side
    this.countryDropdown = new Dropdown('country', this.callbacks.onCountrySelected);

    this.commodityDropdown = new Dropdown('commodity', this.callbacks.onCommoditySelected);

    this.yearsDropdown = new Dropdown('years', null);
    this.yearsMenu = new YearsMenu('js-years-slider', this.callbacks.onYearsSelected);

    // right side
    this.quantDropdown = new Dropdown('quant', this.callbacks.onQuantSelected);
    this.qualDropdown = new Dropdown('qual', this.callbacks.onQualSelected);
    this.viewDropdown = new Dropdown('view', this.callbacks.onViewSelected);

    new BookmarkMenu();
    new Dropdown('bookmark', this.callbacks.onQuantSelected);
    new ShareMenu();
    new Dropdown('share');
  }

  selectYears(years) {
    const title = (years[0] === years[1]) ? years[0] : years.join('&thinsp;-&thinsp;');
    this.yearsDropdown.setTitle(title);
    this.yearsMenu.setYears(years);
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

  selectQual(value) {
    const selectedQualLegend = this.qualDropdown.el.querySelector(`[data-value=${value}]`);
    const selectedQualLegendItems = Array.prototype.slice.call(
      selectedQualLegend.querySelectorAll('.js-dropdown-item-legend li'), 0);
      
    const legendItems = [];
    selectedQualLegendItems.forEach(legend =>
      legendItems.push(legend.className)
    );
    const legendContainer = document.querySelector('.js-dropdown-item-legend-summary');
    legendContainer.innerHTML = legendItems.map(legendItem => `<div class="color ${legendItem}"></div>`).join('');
    this.qualDropdown.selectValue(value);

    if (value === 'none') {
      this.qualDropdown.title.classList.add('-dimmed');
    } else {
      this.qualDropdown.title.classList.remove('-dimmed');
    }
  }

  selectView(value) {
    this.viewDropdown.selectValue(value);
  }
}
