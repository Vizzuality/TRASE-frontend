import SelectorCountriesTemplate from 'ejs!templates/data/selector-countries.ejs';
import SelectorCommoditiesTemplate from 'ejs!templates/data/selector-commodities.ejs';

export default class {

  onCreated() {
    this._setVars();
  }

  _setVars() {
    this.el = document.querySelector('.c-custom-dataset');

    this.selectorCountries = this.el.querySelector('.js-custom-dataset-selector-countries');
    this.selectorCommodities = this.el.querySelector('.js-custom-dataset-selector-commodities');
    this.selectorYears = this.el.querySelector('.js-custom-dataset-selector-years');
    this.selectorCompanies = this.el.querySelector('.js-custom-dataset-selector-companies');
    this.selectorConsumptionCountries = this.el.querySelector('.js-custom-dataset-selector-consumption-countries');
    this.selectorIndicators = this.el.querySelector('.js-custom-dataset-selector-indicators');
    this.selectorOutputType = this.el.querySelector('.js-custom-dataset-selector-output-type');
    this.selectorFormatting = this.el.querySelector('.js-custom-dataset-selector-formatting');
    this.selectorFile = this.el.querySelector('.js-custom-dataset-selector-file');
  }

  fillSelectors(contexts) {
    this.contexts = contexts;

    const countries = contexts
      .map(context => { return {id: context.countryId, name: context.countryName.toLowerCase()} })
      .filter((elem, index, self) => self.findIndex((t) => { return t.id === elem.id; }) === index);

    this.selectorCountries.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorCountriesTemplate({
      countries
    });

    this._setSelectorEvents(this.selectorCountries);
    this._setSelectorEvents(this.selectorYears);
  }

  _setSelectorEvents(selector) {
    const radios = Array.prototype.slice.call(selector.querySelectorAll('.c-radio-btn'), 0);
    radios.forEach((radio) => {
      radio.addEventListener('click', (e) => this._onToggleRadio(e));
    });
  }

  _onToggleRadio(e) {
    const selectedRadio = e && e.currentTarget;
    if (!selectedRadio) return;

    const container = selectedRadio.closest('li');
    const value = selectedRadio.getAttribute('value');
    const group = selectedRadio.getAttribute('data-group');
    const allClosest = this.el.querySelector('.c-radio-btn[data-group="' + group + '-all"]');
    const isEnabled = selectedRadio.classList.contains('-enabled');
    switch (group) {
      case 'countries':
        this._cleanRadios(this.selectorCountries);
        this._updateSelectorCommodities(value);
        break;
      case 'output-type':
        this._cleanRadios(this.selectorOutputType);
        break;
      case 'formatting':
        this._cleanRadios(this.selectorFormatting);
        break;
      case 'file':
        this._cleanRadios(this.selectorFile);
        break;
      case 'years':
        if (allClosest !== null) {
          allClosest.classList.remove('-enabled');
        }
        break;
      case 'years-all':
        if (this.selectorYears.classList.contains('-disabled')) return;

        if (isEnabled) {
          this._cleanRadios(this.selectorYears);
        } else {
          this._selectAllRadios(this.selectorYears);
        }

        break;
    }

    selectedRadio.classList.toggle('-enabled');
    container.classList.toggle('-selected');
    this._checkDependentSelectors();
  }

  _cleanRadios(selector) {
    const radios = Array.prototype.slice.call(selector.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn'), 0);

    radios.forEach((radio) => {
      radio.classList.remove('-enabled');
      radio.closest('li').classList.remove('-selected');
    });
  }

  _checkDependentSelectors() {
    const countriesRadios = this.selectorCountries.querySelectorAll('.c-radio-btn.-enabled');
    const commoditiesRadios = this.selectorCommodities.querySelectorAll('.c-radio-btn.-enabled');

    if (countriesRadios.length > 0 && commoditiesRadios.length > 0) {
      this._showDependentSelectors();
    } else {
      this._hideDependentSelectors();
    }
  }

  _showDependentSelectors() {
    this.selectorYears.classList.remove('-disabled');
  }

  _hideDependentSelectors() {
    this.selectorYears.classList.add('-disabled');
    this.selectorCompanies.classList.add('-disabled');
    this.selectorConsumptionCountries.classList.add('-disabled');
    this.selectorIndicators.classList.add('-disabled');
  }

  _selectAllRadios(selector) {
    const radios = Array.prototype.slice.call(selector.querySelector('.js-custom-dataset-selector-values').querySelectorAll('.c-radio-btn:not(.-disabled)'), 0);

    radios.forEach((radio) => {
      radio.classList.add('-enabled');
      radio.closest('li').classList.add('-selected');
    });
  }

  _updateSelectorCommodities(country) {
    const commodities = this.contexts
      .filter( context => context.id === parseInt(country))
      .map(context => { return {id: context.id, name: context.commodityName.toLowerCase()} });

    this.selectorCommodities.querySelector('.js-custom-dataset-selector-values').innerHTML = SelectorCommoditiesTemplate({
      commodities
    });

    this.selectorCommodities.classList.remove('-disabled');
    this._setSelectorEvents(this.selectorCommodities);
  }
}
