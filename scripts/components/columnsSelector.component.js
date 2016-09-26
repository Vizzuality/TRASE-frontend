import Dropdown from 'components/dropdown.component';
import 'styles/components/columnsSelector.scss';

export default class {
  onCreated() {
    new Dropdown('column0', value => {console.log(value);});
    new Dropdown('column1', value => {console.log(value);});
    new Dropdown('column2', value => {console.log(value);});
    new Dropdown('column3', value => {console.log(value);});
  }

  columnsLoaded(payload) {
    console.log(payload);
  }
}
