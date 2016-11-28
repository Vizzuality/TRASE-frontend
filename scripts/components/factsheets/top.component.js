
import _ from 'lodash';
import formatNumber from 'utils/changeNumber';

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
  }

  _parseData() {
    let baseUrlLink;

    switch (this.targetLink) {
    case 'place':
      baseUrlLink = '/factsheet-place.html?nodeId=';
      break;
    case 'actor':
      baseUrlLink = '/factsheet-actor.html?nodeId=';
      break;
    default:
      baseUrlLink = null;
    }

    this.data.forEach(d => {
      // this verification shouldn't exist. All list must have same data format.
      // Though this is a temporal patch.
      d.value = _.isArray(d.values) ? d.values[0] : formatNumber(d.value, 'percentage');
      d.link = baseUrlLink ? `${baseUrlLink}${d.id}` : null;
    });
  }

  render(renderCallback) {
    if (!this.data.length) return;

    this.el.innerHTML = TopTemplate({
      list: this.data,
      title: this.title,
      unit: this.unit
    });

    if (renderCallback && typeof renderCallback === 'function') {
      renderCallback.apply(this);
    }
  }
}
