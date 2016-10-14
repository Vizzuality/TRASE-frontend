import AreaStack from 'components/factsheets/area-stack.component';


export default class {

  onCreated() {
    this._setVars();

    new AreaStack({
      el: this.municipalitiesGraph
    });
  }

  _setVars() {
    this.el = document.querySelector('.l-factsheets');
    this.municipalitiesGraph = this.el.querySelector('.js-municipalities-top');
  }
}
