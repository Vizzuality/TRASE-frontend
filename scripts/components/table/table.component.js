import TableTemplate from 'ejs!templates/table/table.ejs';
import 'whatwg-fetch';

import 'styles/components/factsheets/area-table.scss';

export default class {
  constructor(settings) {
    this.el = settings.el; //place to show the table
    this.type = settings.type;
    this.data = settings.data;

    if(this.type === 'top'){
      for(let i=0; i<this.data.length; i++) {
        this.data[i]['value'] = (this.data[i]['value']*100).toFixed(2);
      }
    }

    console.log(this.data);

    if(this.type === 't_head_places') {
      for(let i=0; i<this.data['rows'].length; i++) {
        for(let j=0; j<this.data['rows'][i]['values'].length; j++){
          if(this.data['rows'][i]['values'][j] == null){
            this.data['rows'][i]['values'][j] = '0';
          }
        }
      }
    }

    this.render();
  }

  render() {
    let template;
    template = TableTemplate({actors: this.data, type: this.type});
    this.el.innerHTML = template;
  }
}
