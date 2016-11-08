import 'whatwg-fetch';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/layouts/l-factsheet-place.scss';
import 'styles/components/dropdown.scss';
import 'styles/components/button.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/factsheets/info.scss';

import Dropdown from 'components/dropdown.component';
import Line from 'components/graphs/line.component';
import Chord from 'components/graphs/chord.component';
import Table from 'components/table/table.component';

import { getUrlParams } from 'utils/stateURL';
import _ from 'lodash';

const defaults = {
  country: 'brazil',
  commodity: 'soy'
};

const _build = data => {
  // new Line('.js-line', data.trajectory_deforestation, data.trajectory_production);
  new Chord('.js-chord-traders', data.top_traders_matrix, data.top_traders, data.municip_name);
  new Chord('.js-chord-consumers', data.top_consumers_matrix, data.top_consumers, data.municip_name);
  new Table({
    el:document.querySelector('.js-table-traders'),
    data: data.top_traders, // example
    type: 'top'
  });

  new Table({
    el:document.querySelector('.js-table-consumers'),
    data: data.top_consumers, // example
    type: 'top'
  });

  new Table({
    el:document.querySelector('.js-score-table'),
    data: data.sustainability_indicators, // example
    type: 't_head_places'
  });
};

const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;
};

const _setInfo = (info) => {
  document.querySelector('.js-country-name').innerHTML = info.country ? _.capitalize(info.country) : '-';
  document.querySelector('.js-state-name').innerHTML = info.state ?  _.capitalize(info.state) : '-';
  document.querySelector('.js-biome-name').innerHTML = info.biome ? _.capitalize(info.biome) : '-';
  document.querySelector('.js-legend').innerHTML = info.type || '-';
  document.querySelector('.js-municipality').innerHTML = info.municipality ? _.capitalize(info.municipality) : '-';
};

const _init = () => {
  const url = window.location.search;
  const urlParams = getUrlParams(url);
  const nodeId = urlParams.nodeId;
  const country = urlParams.country || defaults.country;
  const commodity = urlParams.commodity || defaults.commodity;

  const commodityDropdown = new Dropdown('commodity', _onSelect);

  commodityDropdown.setTitle(defaults.commodity);

  fetch(`${API_URL}/v1/get_place_node_attributes?node_id=${nodeId}&country=${country}&commodity=${commodity}`)
    .then(response => response.json())
    .then((result) => {
      const data = result.data;
      const info = {
        biome: data.biome_name,
        country: data.country_name,
        municipality: data.municip_name,
        state: data.state_name,
        type: data.column_name
      };

      _setInfo(info);

      _build(data);
    });
};

_init();
