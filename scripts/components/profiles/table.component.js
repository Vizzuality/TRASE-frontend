import TableTemplate from 'ejs!templates/profiles/table/table.ejs';
import formatNumber from 'utils/formatNumber';

import 'styles/components/profiles/area-table.scss';

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

    // this parse would not exist in the future.
    if (this.type === 't_head_actors') {
      for (let i = 0; i < this.data.rows.length; i++) {
        if (this.data.rows[i] !== null && this.data.rows[i].hasOwnProperty('values')) {
          for (let j = 0; j < this.data.rows[i].values.length; j++) {
            if (this.data.rows[i].values[j] !== null && this.data.rows[i].values[j].hasOwnProperty('value')) {
              // there are string values, this way we avoid parse them.
              if (typeof this.data.rows[i].values[j].value !== 'number') continue;
              this.data.rows[i].values[j].value = formatNumber(this.data.rows[i].values[j].value);
            }
          }
        }
      }
    }

    if(this.type === 't_head_places') {
      for(let i = 0; i < this.data.rows.length; i++) {
        for(let j = 0; j < this.data.rows[i].values.length; j++){
          this.data.rows[i].values[j] = formatNumber(this.data.rows[i].values[j]);
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
