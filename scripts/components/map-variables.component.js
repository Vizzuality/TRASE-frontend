import 'styles/components/map/map-layers.scss';
import 'styles/components/shared/radio-btn.scss';
import 'styles/components/shared/switcher.scss';
import MapVariableTemplate from 'ejs!templates/mapVariable.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.c-basemap-options');
    this.layerList = this.el.querySelector('.js-layer-list');
    this.tooltip = document.querySelector('.tooltip-layout');
  }

  loadMapVariables(variables) {
    this.layerList.innerHTML = variables.map(layer => MapVariableTemplate(layer)).join('');

    this._setVars();
    this._setEventListeners();
  }

  selectMapVariables(layers) {
    const mapVariables =  {
      horizontal: layers.horizontal || null,
      vertical: layers.vertical || null
    };

    this._setActiveMapVariables(mapVariables);
  }

  _setVars() {
    this.infoBtns     = Array.prototype.slice.call(this.layerList.querySelectorAll('.js-layer-info'), 0);
    this.downloadBtns = Array.prototype.slice.call(this.layerList.querySelectorAll('.js-layer-download'), 0);
    this.radios       = Array.prototype.slice.call(this.layerList.querySelectorAll('.c-radio-btn'), 0);
  }

  _setEventListeners() {
    this.infoBtns.forEach((infoBtn) => {
      infoBtn.addEventListener('mouseenter', (e) => this._onInfo(e));
      infoBtn.addEventListener('mouseleave', () => this._outInfo());
    });

    this.downloadBtns.forEach((downloadBtn) => {
      downloadBtn.addEventListener('click', (e) => this._onDownload(e));
    });

    this.radios.forEach((radio) => {
      radio.addEventListener('click', (e) => this._onToggleRadio(e));
    });
  }

  _setActiveMapVariables(variables) {
    const directions = Object.keys(variables);

    directions.forEach((group) => {
      const radios = Array.prototype.slice.call(
        this.layerList.querySelectorAll(`.c-radio-btn[data-group="${group}"]`), 0);

      radios.forEach((radio) => {
        if (radio.getAttribute('value') !== variables[group]['uid']) return;
        const layerItem = radio.closest('.layer-item');
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;

        layerItem.classList.add('-selected');
        radio.classList.add('-enabled');
        partnerRadio.classList.add('-disabled');
      });
    });
  }

  _onToggleRadio(e) {
    var radio = e && e.currentTarget;
    if (!radio) return;

    const group = radio.getAttribute('data-group');
    const uid = radio.getAttribute('value');
    const title = this.layerList.querySelector(`.layer-item[data-layer-uid="${uid}"] .layer-name`).innerText;
    const currentSelectedRadio = this.layerList.querySelector('.c-radio-btn.-enabled');

    if (radio === currentSelectedRadio) {
      this._disableRadio(radio);
    } else {
      this._cleanRadiosByGroup(group);
    }

    this.callbacks.onMapVariablesSelected({
      direction: group, // 'vertical' or 'horizontal'
      title,
      uid
    });
  }

  _disableRadio(radio) {
    const layerItem = radio.closest('.layer-item');
    const partnerRadio = radio.nextElementSibling ?
      radio.nextElementSibling : radio.previousElementSibling;

    layerItem.classList.remove('-selected');
    radio.classList.remove('-enabled');
    partnerRadio.classList.remove('-disabled');
  }

  _cleanRadiosByGroup(group) {
    this.radios.forEach((radio) => {
      if (radio.getAttribute('data-group') === group
        && radio.classList.contains('-enabled')) {
        const partnerRadio = radio.nextElementSibling ?
          radio.nextElementSibling : radio.previousElementSibling;
        const layerItem = radio.closest('.layer-item');


        layerItem.classList.remove('-selected');
        radio.classList.remove('-enabled');
        partnerRadio.classList.remove('-disabled');
      }
    });
  }


  // TODO: develop info function once is clear how it works
  _onInfo(e) {
    const target = e && e.currentTarget; //the information icon
    const bounds = target.getBoundingClientRect(); //position of the icon
    const top = bounds.top; // top
    const left = bounds.left + 24; //left
    const uid = target.closest('.layer-item').getAttribute('data-layer-uid');

    this.tooltip.classList.remove('is-hidden');
    this.tooltip.classList.add('is-visible');

    const topTooltip = top - (this.tooltip.getBoundingClientRect().height/2) + 8;

    this.tooltip.style.top = `${topTooltip}px`;
    this.tooltip.style.left = `${left}px`;
    this.tooltip.innerHTML = `showing info of ${uid}`;
  }

  _outInfo() {
    this.tooltip.classList.remove('is-visible');
    this.tooltip.classList.add('is-hidden');
  }

  // TODO: develop download function once is clear how it works
  _onDownload() {
  }
}
