import TableTemplate from 'ejs!templates/table/table.ejs';
import 'whatwg-fetch';

import 'styles/components/factsheets/area-table.scss';

export default class {
  constructor(settings) {
    this.el = settings.el; //place to show the table
    this.type = settings.type;

    if(this.type === 'table_actors'){
      fetch('factsheets/table.json')
        .then(response => response.json())
        .then((json) => {
          this.data = json;
          this.render();
        });
    } else {
      this.data = settings.data;
      // console.log(this.data['includedColumns']);
      this.render();
    }
  }

  render() {
    let template;
    template = TableTemplate({actors: this.data, type: this.type});
    this.el.innerHTML = template;
  }
}
