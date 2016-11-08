import TableTemplate from 'ejs!templates/table/table.ejs';
import 'whatwg-fetch';

import 'styles/components/factsheets/area-table.scss';

export default class {
  constructor(settings) {
    this.el = settings.el; //place to show the table
    this.type = settings.type;

    if(this.type === 'table_header'){
      this.getData()
        .then(response => response.json())
        .then((json) => {
          this.data = json;
          this.render();
        });
    } else {
      this.data = settings.data; //now a json next API
      this.render();
    }
  }

  getData() {
    return fetch('factsheets/table.json');
  }

  render() {
    let template;
    template = TableTemplate({actors: this.data, type: this.type});
    this.el.innerHTML = template;
  }
}
