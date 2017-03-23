import Dropdown from 'components/dropdown.component';
import YearsMenu from 'components/nav/years-brush/years-slider.component';
import 'styles/components/shared/nav.scss';
import CountryCommodityTemplate from 'ejs!templates/flows-nav-context/countryCommodity.ejs';
import FiltersTemplate from 'ejs!templates/flows-nav-context/filters.ejs';
import ResizeByTemplate from 'ejs!templates/flows-nav-context/resizeBy.ejs';
import RecolorByTemplate from 'ejs!templates/flows-nav-context/recolorBy.ejs';
import Tooltip from 'tether-tooltip';
import _ from 'lodash';

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

  renderContext({ contexts, selectedContextId, tooltips}) {
    let currentContext = contexts ? contexts.find(elem => elem.id === selectedContextId) : null;
    let filters = null;
    let resizeBy = null;
    let recolorBy = null;

    if (currentContext) {
      filters = (currentContext.filterBy && currentContext.filterBy.length > 0) ? currentContext.filterBy[0] : null;
      resizeBy = currentContext.resizeBy.sort((a, b) => a.position > b.position);
      recolorBy = currentContext.recolorBy.sort((a, b) => (a.groupNumber === b.groupNumber) ? (a.position > b.position) : (a.groupNumber > b.groupNumber));
    }

    document.querySelector('.js-context-countryCommodity').innerHTML = CountryCommodityTemplate({ contexts, tooltips });

    if (filters) {
      document.querySelector('.js-context-filters').innerHTML = FiltersTemplate({ filters, tooltips });
    }
    document.querySelector('.js-context-filters').classList.toggle('is-hidden', filters === null);

    document.querySelector('.js-context-resizeBy').innerHTML = ResizeByTemplate({ resizeBy, tooltips });
    document.querySelector('.js-context-recolorBy').innerHTML = RecolorByTemplate({
      recolorBy: this._generateRecolorByOption(recolorBy),
      tooltips
    });

    if (currentContext) {

      // left side
      this.contextDropdown = new Dropdown('context', this.callbacks.onContextSelected, true, true);
      if (filters) {
        this.biomeFilterDropdown = new Dropdown('biomeFilter', this.callbacks.onBiomeFilterSelected, true, true);
      }
      this.yearsDropdown = new Dropdown('years', null);
      this.yearsMenu = new YearsMenu('js-years-slider', this.callbacks.onYearsSelected);

      // right side
      this.resizeByDropdown = new Dropdown('resize-by', this.callbacks.onResizeBySelected, true, true);
      this.recolorByDropdown = new Dropdown('recolor-by', this.callbacks.onRecolorBySelected, false, true);

      this.legendContainer = document.querySelector('.js-dropdown-item-legend-summary');
    }

  }

  _generateRecolorByOption(recolorBy) {
    if (recolorBy === null) {
      return null;
    }

    return recolorBy.map(recolorByElem => {
      recolorByElem.label = recolorByElem.label || recolorByElem.name;
      switch (recolorByElem.legendType) {
        case 'qual': {
          recolorByElem.options = [];
          recolorByElem.nodes.forEach(node => recolorByElem.options.push({
            class: `-${_.toLower(recolorByElem.type)}-${_.toLower(recolorByElem.legendType)}-${_.toLower(recolorByElem.legendColorTheme)}-${_.toLower(node)}`.replace(/ /g, '-'),
            label: _.capitalize(node)
          }));
          break;
        }
        case 'stars':
        case 'linear': {
          recolorByElem.options = [];
          _.range(recolorByElem.intervalCount).forEach(node => recolorByElem.options.push({
            class: `-${_.toLower(recolorByElem.type)}-${_.toLower(recolorByElem.legendType)}-${_.toLower(recolorByElem.legendColorTheme)}-${_.toLower(node)}`.replace(/ /g, '-'),
            label: ''
          }));
          break;
        }
      }
      return recolorByElem;
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

  selectYears(years) {
    if (!this.yearsDropdown) {
      return;
    }
    const title = (years[0] === years[1]) ? years[0] : years.join('&thinsp;-&thinsp;');
    this.yearsDropdown.setTitle(title);
    this.yearsMenu.setYears(years);
  }

  selectBiomeFilter(value) {
    if (!this.biomeFilterDropdown || !value) {
      return;
    }
    this.biomeFilterDropdown.selectValue(value.name);
  }

  selectContext(selectedContext) {
    if (!this.contextDropdown || !selectedContext) {
      return;
    }
    this.contextDropdown.selectValue(selectedContext.id);
    this.yearsMenu.setAvailableYears(selectedContext.years);
  }

  selectResizeBy(value) {
    if (!this.resizeByDropdown || !value || !value.name) {
      return;
    }
    this.resizeByDropdown.selectValue(value.name);
  }

  selectRecolorBy(data) {
    if (!this.recolorByDropdown) {
      return;
    }
    let recolorByValue = data.name;

    const selectedRecolorByLegend = this.recolorByDropdown.el.querySelector(`[data-value="${recolorByValue}"]`);
    const selectedRecolorByLegendItems = Array.prototype.slice.call(selectedRecolorByLegend.querySelectorAll('.js-dropdown-item-legend li'), 0);

    const legendItems = [];
    selectedRecolorByLegendItems.forEach(legend => legendItems.push(legend.className));
    this.legendContainer.innerHTML = legendItems.map(legendItem => `<div class="color ${legendItem}"></div>`).join('');
    this.recolorByDropdown.selectValue(recolorByValue);
  }

  updateNodeSelectionColors(colors) {
    if (colors === null || colors.length === 0) {
      return;
    }
    this.legendContainer.innerHTML = colors.map(color => `<div class="color -flow-${color}" style="order:${color};"></div>`).join('');
  }

  selectView(value) {
    if (!this.viewDropdown) {
      return;
    }
    this.viewDropdown.selectValue(value);
  }
}
