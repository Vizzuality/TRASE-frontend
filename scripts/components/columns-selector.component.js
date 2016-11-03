import _ from 'lodash';
import Dropdown from 'components/dropdown.component';
import ColumnsSelectorTemplate from 'ejs!templates/columns-selector.ejs';
import 'styles/components/columns-selector.scss';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-columns-selector');
  }

  buildColumns({columns, selectedColumnsIds}) {
    const columnsByPosition = [];
    columns.forEach(column => {
      if (!columnsByPosition[column.position]) {
        columnsByPosition[column.position] = [_.cloneDeep(column)];
      } else {
        columnsByPosition[column.position].push(_.cloneDeep(column));
      }
    });
    this.el.innerHTML = ColumnsSelectorTemplate({columnsByPosition});
    this.dropdowns = columnsByPosition.map((columns, i) => new Dropdown(`column${i}`, this._onDropdownValueSelected.bind(this)));
    
    this.selectColumns(selectedColumnsIds);
  }

  selectColumns(columnIds) {
    if (this.dropdowns === undefined) {
      return;
    }
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
