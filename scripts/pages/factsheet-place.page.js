import 'whatwg-fetch';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/layouts/l-factsheets-place.scss';
import 'styles/components/dropdown.scss';
import 'styles/components/button.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';

import Dropdown from 'components/dropdown.component';
import Line from 'components/graphs/line.component';
import Chord from 'components/graphs/chord.component';
import Top10 from 'components/graphs/top10.component';

const defaults = {
  exporter: 'Brazil',
  commodity: 'Soy',
};

const _build = data => {
  new Line('.js-line', data.trajectory_deforestation, data.trajectory_production);
  new Chord('.js-chord-traders', data.top_traders_matrix, data.top_traders, data.municip_name);
  new Top10(document.querySelector('.js-top10-traders'), 'Top traders', data.top_traders, 4);
  new Top10(document.querySelector('.js-top10-consumers'), 'Top consumers', data.top_consumers);
  new Chord('.js-chord-consumers', data.top_consumers_matrix, data.top_consumers, data.municip_name);
};

const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;
};

const _init = () => {
  const nodeId = location.search.substr(1).replace('nodeId=','');
  const country = defaults.exporter.toLowerCase();
  const commodity = defaults.commodity.toLowerCase();

  const municipalityDropdown = new Dropdown('municipality', _onSelect);
  const commodityDropdown = new Dropdown('commodity', _onSelect);

  municipalityDropdown.setTitle(defaults.exporter);
  commodityDropdown.setTitle(defaults.commodity);

  fetch(`${API_URL}/v1/get_place_node_attributes?node_id=${nodeId}&country=${country}&commodity=${commodity}`)
    .then(response => response.json())
    .then((result) => {
      _build(result.data);
    });
};

_init();
