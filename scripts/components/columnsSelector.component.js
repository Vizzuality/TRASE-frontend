import Dropdown from 'components/dropdown.component';
import 'styles/components/columnsSelector.scss';

export default class {
  onCreated() {
    this.dropdowns = [
      new Dropdown('column0', value => {console.log(value);}),
      new Dropdown('column1', value => {console.log(value);}),
      new Dropdown('column2', value => {console.log(value);}),
      new Dropdown('column3', value => {console.log(value);})
    ]
  }

  selectColumns(columnIds) {
    for (var i = 0; i < this.dropdowns.length; i++) {
      this.dropdowns[i].selectValue(columnIds[i]);
    }
  }

  columnsLoaded(payload) {
    console.log(payload);
  }
}
