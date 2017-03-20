import _ from 'lodash';
import Dropdown from 'components/dropdown.component';
import ColumnsSelectorTemplate from 'ejs!templates/columns-selector.ejs';
import 'styles/components/columns-selector.scss';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-columns-selector');
  }

  buildColumns({columns, selectedColumnsIds, sankeySize}) {
    const columnsByGroup = [];
    columns.forEach(column => {
      if (!columnsByGroup[column.group]) {
        columnsByGroup[column.group] = [_.cloneDeep(column)];
      } else {
        columnsByGroup[column.group].push(_.cloneDeep(column));
      }
    });
    this.el.innerHTML = ColumnsSelectorTemplate({ columnsByGroup });
    this.dropdowns = columnsByGroup.map((columns, i) => new Dropdown(`column${i}`, this._onDropdownValueSelected.bind(this)));

    this.selectColumns(selectedColumnsIds);
    this.resize(sankeySize);
  }

  resize(sankeySize) {
    this.el.style.width = `${sankeySize[0]}px`;
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
    const columnIndex = parseInt(dropdownId.replace('column', ''), 10);
    const columnId = parseInt(rawColumnId, 10);
    this.callbacks.onColumnSelected(columnIndex, columnId);
  }
}
