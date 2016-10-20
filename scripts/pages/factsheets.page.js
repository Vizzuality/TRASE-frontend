import 'styles/factsheets.scss';

import AreaStack from 'scripts/statics/factsheets/area-stack';

class factsheetsIndex {

  constructor() {
    this._setVars();
    this._renderAreaStack();
  }

  _renderAreaStack() {
    new AreaStack({
      el: this.municipalitiesGraph
    });
  }

  _setVars() {
    this.el = document.querySelector('.l-factsheets');
    this.municipalitiesGraph = this.el.querySelector('.js-municipalities-top');
  }
}

new factsheetsIndex();
