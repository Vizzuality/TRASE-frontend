import Dropdown from 'components/dropdown.component';
import 'styles/components/columnsSelector.scss';

export default class {
  onCreated() {
    this.dropdowns = [
      new Dropdown('column0', this._onDropdownValueSelected.bind(this)),
      new Dropdown('column1', this._onDropdownValueSelected.bind(this)),
      new Dropdown('column2', this._onDropdownValueSelected.bind(this)),
      new Dropdown('column3', this._onDropdownValueSelected.bind(this))
    ];
  }

  selectColumns(columnIds) {
    for (var i = 0; i < this.dropdowns.length; i++) {
      this.dropdowns[i].selectValue(columnIds[i]);
    }
  }

  _onDropdownValueSelected(rawColumnId, dropdownId) {
    const columnIndex = parseInt(dropdownId.replace('column',''), 10);
    const columnId = parseInt(rawColumnId, 10);
    this.callbacks.onColumnSelected(columnIndex, columnId);
  }
}
