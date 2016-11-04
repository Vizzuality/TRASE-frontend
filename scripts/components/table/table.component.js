import TableTemplate from 'ejs!templates/table/table.ejs';
import TableTopTemplate from 'ejs!templates/table/tableTop.ejs';
import 'whatwg-fetch';

export default class {
  constructor(value) {
    this.data = null;
    this.getData()
      .then(response => response.json())
      .then((json) => {
        this.data = json;
        this.render();
      });
  }

  getData() {
    return fetch('factsheets/table.json');
  }

  render(value) {
    var areamunicipalities = document.querySelector('.js-municipalities-table');

    if(value === 'top'){
      const template = TableTopTemplate({actors: this.data});
      areamunicipalities.innerHTML = template;
    }else {
      console.log(this.data);
      const template = TableTemplate({actors: this.data});
      areamunicipalities.innerHTML = template;
    }
  }
}
