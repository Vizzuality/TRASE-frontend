import MultiTableTemplate from 'ejs!templates/table/multi-table.ejs';
import Table from 'components/factsheets/table.component';

export default class {
  constructor(settings) {
    this.el = settings.el; //place to show the table
    this.type = settings.type;
    this.data = settings.data;
    this.target = settings.target;
    this.key = `table_${new Date().getTime()}`;

    this.render();
  }

  render() {
    const template = MultiTableTemplate({data: this.data, key: this.key});
    this.el.innerHTML = template;

    this._renderTables();
    this.el.parentElement.classList.remove('is-hidden');

    this.switchers = Array.prototype.slice.call(this.el.querySelectorAll('.js-multi-table-switcher'), 0);
    this.singleTables = Array.prototype.slice.call(this.el.querySelectorAll('.js-multi-table-container'), 0);
    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', (e) => this._switchTable(e));
    });
  }

  _renderTables() {
    this.data.forEach((indicator, i) => {
      new Table({
        el: document.querySelector(`.${this.key}_${i}`),
        data: indicator,
        type: this.type
      });
    });
  }

  _switchTable(e) {
    const selectedSwitch = e && e.currentTarget;
    if (!selectedSwitch) {
      return;
    }

    const selectedTable = selectedSwitch.getAttribute('data-table');
    this.singleTables.forEach(table => {
      table.classList.add('is-hidden');
    });
    this.switchers.forEach(switcher => {
      switcher.classList.remove('selected');
    });

    this.el.querySelector(`.${selectedTable}`).classList.remove('is-hidden');
    selectedSwitch.classList.add('selected');
  }
}
