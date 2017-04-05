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
import Line from 'components/graphs/line.component';
import Chord from 'components/graphs/chord.component';
import Top from 'components/factsheets/top.component';
import Table from 'components/table/table.component';

import { select as d3_select } from 'd3-selection';
import { json as d3_json } from 'd3-request';
import { geoPath as d3_geoPath, /*geoAlbersUsa as d3_geoAlbersUsa,*/ geoMercator as d3_geoMercator } from 'd3-geo';
import * as topojson from 'topojson';
import { getURLParams } from 'utils/stateURL';
import formatNumber from 'utils/formatNumber';
import _ from 'lodash';
import { getURLFromParams, GET_PLACE_FACTSHEET } from '../utils/getURLFromParams';

const defaults = {
  country: 'Brazil',
  commodity: 'Soy'
};

let featureBounds;
let geo;
const width = 300;
const height = 200;

function getFeaturesBox() {
  return {
    x: featureBounds[0][0],
    y: featureBounds[0][1],
    width: featureBounds[1][0] - featureBounds[0][0],
    height: featureBounds[1][1] - featureBounds[0][1]
  };
}

// fits the geometry layer inside the viewport
function fitGeoInside() {
  const bbox = getFeaturesBox();
  const scale = 1 / Math.max(bbox.width / width, bbox.height / height);
  const trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

  geo.attr('transform', [
    'translate(' + trans + ')',
    'scale(' + scale + ')'
  ].join(' '));

  geo.selectAll('path').style('stroke-width', 1 / scale);
}

const _build = data => {

  const svg = d3_select('.js-map-municipality').append('svg')
    .attr('width', width)
    .attr('height', height);

  const geoParent = svg.append('g');
  geo = geoParent.append('g');

  const projection = d3_geoMercator();
  const path = d3_geoPath()
    .projection(projection);

  const countryName = 'BRAZIL';
  const stateGeoID = data.state_geoId;
  const municipGeoID = data.municip_geoId;

  const filePath = `./vector_layers/municip_states/brazil/${stateGeoID}.topo.json`;
  const topoJSONRoot = `${countryName}_${stateGeoID}`;

  const isCurrentMunicipality = d => d.properties.geoid === municipGeoID;

  d3_json(filePath, function(error, topoJSON) {
  // d3_json('./us.json', function(error, topoJSON) {
    const features = topojson.feature(topoJSON, topoJSON.objects[topoJSONRoot]);
    // const features = topojson.feature(topoJSON, topoJSON.objects.states);
    geo.selectAll('path')
      .data(features.features)
      .enter()
      .append('path')
      .attr('class', d => {
        return isCurrentMunicipality(d) ? 'polygon -isCurrent' : 'polygon';
      })
      .attr('d', path);

    const collection = {
      'type': 'FeatureCollection',
      'features' : features.features
    };
    featureBounds = path.bounds(collection);
    fitGeoInside();
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
