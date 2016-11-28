import TableTemplate from 'ejs!templates/table/table.ejs';
import 'whatwg-fetch';
import changeNumber from 'utils/changeNumber';

import 'styles/components/factsheets/area-table.scss';

export default class {
  constructor(settings) {
    this.el = settings.el; //place to show the table
    this.type = settings.type;
    this.data = settings.data;
    this.target = settings.target;

    if (this.target === 'actor') {
      this.link = 'factsheet-actor.html?nodeId=';
    } else if (this.target === 'place') {
      this.link = 'factsheet-place.html?nodeId=';
    } else {
      this.link = null;
    }

    if(this.type === 't_head_places') {
      for(let i=0; i<this.data['rows'].length; i++) {
        for(let j=0; j<this.data['rows'][i]['values'].length; j++){
          if(this.data['rows'][i]['values'][j] == null){
            this.data['rows'][i]['values'][j] = 'N/A';
          } else {
            this.data['rows'][i]['values'][j] = changeNumber(this.data['rows'][i]['values'][j]);
          }
        }
      }
    }

    this.render();
  }

  render() {
    const template = TableTemplate({data: this.data, type: this.type, link: this.link});
    this.el.innerHTML = template;
    this.el.parentElement.classList.remove('is-hidden');
  }
}
