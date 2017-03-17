import _ from 'lodash';
import formatNumber from 'utils/formatNumber';
import TopTemplate from 'ejs!templates/factsheets/top.ejs';
import 'styles/components/factsheets/top.scss';

export default class {

  constructor(settings) {
    this.el = settings.el;
    this.data = settings.data;
    this.title = settings.title;
    this.targetLink = settings.targetLink;
    this.unit = settings.unit;

    this._parseData();
    this._render();
  }

  _parseData() {
    const baseUrlLink = this.targetLink ? `/factsheet-${this.targetLink}.html?nodeId=` : null;

    this.data.forEach(d => {
      // this verification shouldn't exist. All list must have same data format.
      // Though this is a temporal patch.
      d.value = _.isArray(d.values) ? formatNumber(d.values[0]) : formatNumber(d.value, true);
      d.link = baseUrlLink ? `${baseUrlLink}${d.id}` : null;
    });
  }

  _render() {
    this.el.innerHTML = TopTemplate({
      list: this.data, title: this.title, unit: this.unit
    });
  }
}
