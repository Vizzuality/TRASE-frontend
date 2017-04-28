import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profile-place.scss';
import 'styles/components/shared/dropdown.scss';
import 'styles/components/shared/button.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/profiles/overall-info.scss';
import 'styles/components/profiles/info.scss';
import 'styles/components/profiles/link-buttons.scss';
import 'styles/components/profiles/error.scss';
import 'styles/components/profiles/map.scss';

import Nav from 'components/shared/nav.component.js';
import Dropdown from 'components/shared/dropdown.component';
import Top from 'components/profiles/top.component';
import Line from 'components/profiles/line.component';
import Chord from 'components/profiles/chord.component';
import MultiTable from 'components/profiles/multi-table.component';
import Map from 'components/profiles/map.component';

import { getURLParams } from 'utils/stateURL';
import formatNumber from 'utils/formatNumber';
import smoothScroll from 'utils/smoothScroll';
import _ from 'lodash';
import { getURLFromParams, GET_PLACE_FACTSHEET } from '../utils/getURLFromParams';

const defaults = {
  country: 'Brazil',
  commodity: 'Soy'
};

const _build = data => {
  const stateGeoID = data.state_geoId;

  Map('.js-map-country', {
    topoJSONPath: './vector_layers/WORLD.topo.json',
    topoJSONRoot: 'WORLD',
    getPolygonClassName: d => (d.properties.iso2 === data.country_geoId) ? '-isCurrent' : '',
    useRobinsonProjection: true
  });

  Map('.js-map-biome', {
    topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_BIOME.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_BIOME`,
    getPolygonClassName: d => (d.properties.geoid === data.biome_geoId) ? '-isCurrent' : ''
  });

  Map('.js-map-state', {
    topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_STATE.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_STATE`,
    getPolygonClassName: d => (d.properties.geoid === stateGeoID) ? '-isCurrent' : ''
  });

  Map('.js-map-municipality', {
    topoJSONPath: `./vector_layers/municip_states/${defaults.country.toUpperCase().toLowerCase()}/${stateGeoID}.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_${stateGeoID}`,
    getPolygonClassName: d => (d.properties.geoid === data.municip_geoId) ? '-isCurrent' : ''
  });

  new Line('.js-line', data.trajectory_deforestation);

  if (data.top_traders.actors.length) {
    new Chord('.js-chord-traders', data.top_traders.matrix, data.top_traders.actors, data.municip_name);

    new Top({
      el: document.querySelector('.js-top-trader'),
      data: data.top_traders.actors,
      targetLink: 'actor',
      title: `Top traders of soy in ${data.municip_name}`,
      unit: '%'
    });

    document.querySelector('.js-traders').classList.toggle('is-hidden', false);
  }

  if (data.top_consumers.countries.length) {
    new Chord('.js-chord-consumers', data.top_consumers.matrix, data.top_consumers.countries, data.municip_name);

    new Top({
      el: document.querySelector('.js-top-consumer'),
      data: data.top_consumers.countries,
      title: `Top consumers of ${_formatApostrophe(data.municip_name)} soy`,
      unit: '%'
    });

    document.querySelector('.js-consumers').classList.toggle('is-hidden', false);
  }

  if (data.indicators.length) {
    new MultiTable({
      el: document.querySelector('.js-score-table'),
      data: data.indicators,
      tabsTitle: 'Sustainability indicators:',
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

const _setInfo = (info, nodeId) => {
  document.querySelector('.js-country-name').innerHTML = info.country ? _.capitalize(info.country) : '-';
  document.querySelector('.js-state-name').innerHTML =
    document.querySelector('.js-chord-traders-state-name').innerHTML =
    document.querySelector('.js-chord-consumers-state-name').innerHTML =
    info.state ?  _.capitalize(info.state) : '-';
  document.querySelector('.js-biome-name').innerHTML = info.biome ? _.capitalize(info.biome) : '-';
  document.querySelector('.js-legend').innerHTML = info.type || '-';
  document.querySelector('.js-municipality').innerHTML = info.municipality ? _.capitalize(info.municipality) : '-';
  document.querySelector('.js-area').innerHTML = info.area !== null ? info.area : '-';
  document.querySelector('.js-soy-land').innerHTML = info.soy_land !== null ? formatNumber(info.soy_land, 'percentage') : '-';
  document.querySelector('.js-agriculture-land').innerHTML = info.agriculture_land !== null ? formatNumber(info.agriculture_land, 'percentage') : '-';
  document.querySelector('.js-link-map').setAttribute('href', `./flows.html?selectedNodesIds=[${nodeId}]&isMapVisible=true`);
  document.querySelector('.js-link-supply-chain').setAttribute('href', `./flows.html?selectedNodesIds=[${nodeId}]`);
  document.querySelector('.js-line-title').innerHTML = info.municipality ? `Deforestation trajectory of ${info.municipality}` : '-';
  document.querySelector('.js-summary-text').innerHTML = info.summary ? info.summary : '-';
  document.querySelector('.js-municipality').innerHTML = info.municipality;
  document.querySelector('.js-link-button-municipality').textContent = _formatApostrophe(info.municipality) + ' PROFILE';

};

const  _formatApostrophe = (text) => {
  if (text) {
    const name =_.capitalize(text);
    return _.endsWith(name, 's') ? name + '\'' : name + '\'s';
  }
  return '-';
};

const _setEventListeners = () => {
  smoothScroll(document.querySelectorAll('.js-link-profile'));
};

const _showErrorMessage = () => {
  const el = document.querySelector('.l-factsheet-place');
  document.querySelector('.js-loading').classList.add('is-hidden');
  el.classList.add('-error');
  el.querySelector('.js-wrap').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
};

const _init = () => {
  const url = window.location.search;
  const urlParams = getURLParams(url);
  const nodeId = urlParams.nodeId;

  const commodityDropdown = new Dropdown('commodity', _onSelect);

  commodityDropdown.setTitle(defaults.commodity);

  const placeFactsheetURL = getURLFromParams(GET_PLACE_FACTSHEET, { node_id: nodeId}, true);

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

      document.querySelector('.js-loading').classList.add('is-hidden');
      document.querySelector('.js-wrap').classList.remove('is-hidden');

      const data = result.data;

      const info = {
        area: data.area,
        agriculture_land: data.farming_GDP,
        biome: data.biome_name,
        country: data.country_name,
        municipality: data.municip_name,
        soy_land: data.soy_farmland,
        state: data.state_name,
        type: data.column_name,
        summary: data.summary
      };

      _setInfo(info, nodeId);
      _setEventListeners();

      _build(data);
    });

  new Nav();

};

_init();
