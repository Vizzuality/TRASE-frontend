import _ from 'lodash';

import 'styles/_texts.scss';
import 'styles/components/button.scss';
import 'styles/components/shared/modal.scss';

import ModalTemplate from 'ejs!templates/shared/modal.ejs';

export default class {

  onCreated() {
    this.state = {};
    this._setVars();
    this._setEventListeners();
  }

  _setVars() {
    this.el = document.querySelector('.js-modal');
    this.veil = document.querySelector('.js-veil');
  }

  _setEventListeners() {
    this.veil.addEventListener('click', () => this._toggleVisibility());
    document.onkeydown = (e) => this._onKeyDown(e);
  }

  _onKeyDown(e) {
    if(e && e.keyCode !== 27) return;

    if (!this.state.visibility) return;

    this._toggleVisibility();
  }

  _toggleVisibility() {
    Object.assign(this.state, { visibility: !this.state.visibility});
    this._setVisibility();
  }

  getModal(modalParams) {
    // compares data object to determinate if modal should render new content
    if (!(_.isEqual(modalParams.data, this.state.data))) {
      Object.assign(this.state, modalParams);
      this.render();

    } else {
      // if data is the same as before, just toggle ths visibility of the modal
      this._toggleVisibility();
    }
  }

  _setVisibility() {
    this.el.classList.toggle('is-hidden', !this.state.visibility);
    this.veil.classList.toggle('is-hidden', !this.state.visibility);
  }

  render() {
    // sample data. TO DELETE.
    const data = {
      title: 'Will Cerrado forest survive the soy boom?',
      description: 'Production and international trade of "forest risk" commodities is driving \
        two-thirds of tropical deforestation and shaping the future of biodiversity, climate change and  \
        rural development across the planet.',
      link: {
        name: 'explore the supply chain',
        url: 'url_link'
      }
    };

    const modalContent = ModalTemplate({ data });

    this.el.innerHTML = modalContent;
    this._setVisibility();
  }
}
