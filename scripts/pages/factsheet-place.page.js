import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-factsheet-place.scss';
import 'styles/components/dropdown.scss';
import 'styles/components/button.scss';
import 'styles/components/loading.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/factsheets/info.scss';
import 'styles/components/factsheets/error.scss';
import 'styles/components/factsheets/locator-map.scss';
import 'styles/components/loading.scss';

import Nav from 'components/nav.component.js';
import Dropdown from 'components/dropdown.component';
import Top from 'components/factsheets/top.component';
import Line from 'components/factsheets/line.component';
import Chord from 'components/factsheets/chord.component';
import Table from 'components/factsheets/table.component';
import LocatorMap from 'components/factsheets/locator-map.component';

import { getURLParams } from 'utils/stateURL';
import formatNumber from 'utils/formatNumber';
import _ from 'lodash';
import { getURLFromParams, GET_PLACE_FACTSHEET } from '../utils/getURLFromParams';

const defaults = {
  country: 'Brazil',
  commodity: 'Soy'
};


const _build = data => {

  const countryName = 'BRAZIL';
  const stateGeoID = data.state_geoId;
  const municipGeoID = data.municip_geoId;

  LocatorMap('.js-map-state', {
    topoJSONPath: `./vector_layers/${countryName}_STATE.topo.json`,
    topoJSONRoot: `${countryName}_STATE`,
    isCurrent: d => d.properties.geoid === stateGeoID
  });

  LocatorMap('.js-map-municipality', {
    topoJSONPath: `./vector_layers/municip_states/${countryName.toLowerCase()}/${stateGeoID}.topo.json`,
    topoJSONRoot: `${countryName}_${stateGeoID}`,
    isCurrent: d => d.properties.geoid === municipGeoID
  });

  new Line('.js-line', data.trajectory_deforestation, data.trajectory_production);

  if (data.top_traders.length) {
    new Chord('.js-chord-traders', data.top_traders_matrix, data.top_traders, data.municip_name);

    new Top({
      el: document.querySelector('.js-top-trader'),
      data: data.top_traders,
      targetLink: 'actor',
      title: 'top traders',
      unit: '%'
    });

    document.querySelector('.js-traders').classList.toggle('is-hidden', false);
  }

  if (data.top_consumers.length) {
    new Chord('.js-chord-consumers', data.top_consumers_matrix, data.top_consumers, data.municip_name);

    new Top({
      el: document.querySelector('.js-top-consumer'),
      data: data.top_consumers,
      title: 'top consumers',
      unit: '%'
    });

    document.querySelector('.js-consumers').classList.toggle('is-hidden', false);
  }

  if (data.sustainability_indicators.rows.length) {
    new Table({
      el: document.querySelector('.js-score-table'),
      data: data.sustainability_indicators,
      type: 't_head_places'
    });
  }


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
  document.querySelector('.js-area').innerHTML = info.area !== null ? info.area : '-';
  document.querySelector('.js-soy-land').innerHTML = info.soy_land !== null ? formatNumber(info.soy_land, 'percentage') : '-';
  document.querySelector('.js-agriculture-land').innerHTML = info.agriculture_land !== null ? formatNumber(info.agriculture_land, 'percentage') : '-';
};

const _showErrorMessage = () => {
  const el = document.querySelector('.l-factsheet-place');
  document.querySelector('.c-loading').classList.add('is-hidden');
  el.classList.add('-error');
  el.querySelector('.wrap').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
};

const _init = () => {
  const url = window.location.search;
  const urlParams = getURLParams(url);
  const nodeId = urlParams.nodeId;

  const commodityDropdown = new Dropdown('commodity', _onSelect);

  commodityDropdown.setTitle(defaults.commodity);

  const placeFactsheetURL = getURLFromParams(GET_PLACE_FACTSHEET, { node_id: nodeId});

  fetch(placeFactsheetURL)
    .then((response) => {
      if (response.status === 404) {
        _showErrorMessage();
        return null;
      }

      if (response.status === 200) {
        return response.json();
      }
    })
    .then((result) => {
      if (!result) return;

      document.querySelector('.c-loading').classList.add('is-hidden');
      document.querySelector('.wrap').classList.remove('is-hidden');

      const data = result.data;

      const info = {
        area: data.area,
        agriculture_land: data.farming_GDP,
        biome: data.biome_name,
        country: data.country_name,
        municipality: data.municip_name,
        soy_land: data.soy_farmland,
        state: data.state_name,
        type: data.column_name
      };

      _setInfo(info);

      _build(data);
    });

  new Nav();

};

_init();
