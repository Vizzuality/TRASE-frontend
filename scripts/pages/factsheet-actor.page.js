import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-factsheet-actor.scss';
import 'styles/components/button.scss';
import 'styles/components/loading.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/factsheets/area-select.scss';
import 'styles/components/factsheets/info.scss';
import 'styles/components/factsheets/error.scss';
import 'styles/components/loading.scss';

import Nav from 'components/nav.component.js';
import Dropdown from 'components/dropdown.component';
// import AreaStack from 'components/graphs/area-stack.component';  stack area future
import Top from 'components/factsheets/top.component';
import Table from 'components/table/table.component';

import { getURLParams } from 'utils/stateURL';
import _ from 'lodash';
import { getURLFromParams, GET_ACTOR_FACTSHEET } from '../utils/getURLFromParams';

const defaults = {
  commodity: 'soy',
};

const _onSelect = function(value) {
  this.setTitle(value);
  defaults[this.id] = value;
};

const _setInfo = (type, name, forest_500, zero_deforestation) => {
  document.querySelector('.js-legend').innerHTML = type || '-';
  document.querySelector('.js-name').innerHTML = name ? _.capitalize(name) : '-';
  if (forest_500 > 0) document.querySelector('.forest-500-score .star-icon[data-value="1"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-star');
  if (forest_500 > 1) document.querySelector('.forest-500-score .star-icon[data-value="2"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-star');
  if (forest_500 > 2) document.querySelector('.forest-500-score .star-icon[data-value="3"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-star');
  if (forest_500 > 3) document.querySelector('.forest-500-score .star-icon[data-value="4"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-star');
  if (forest_500 > 4) document.querySelector('.forest-500-score .star-icon[data-value="5"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-star');
  if (zero_deforestation === 'YES') {
    document.querySelector('.zero-deforestation-commitment span[data-value="yes"]').classList.remove('is-hidden');
  } else {
    document.querySelector('.zero-deforestation-commitment span[data-value="no"]').classList.remove('is-hidden');
  }
};

const _build = data => {
  if (data.top_municipalities.lines.length) {
    new Top({
      el: document.querySelector('.js-top-municipalities'),
      data: data.top_municipalities.lines,
      targetLink: 'place',
      title: 'top source municipalities in 2015'
    });
  }

  if (data.top_countries.lines.length) {
    new Top({
      el:document.querySelector('.js-top-destination'),
      data: data.top_countries.lines,
      title: 'top destination countries in 2015'
    });
  }

  // new AreaStack({
  //   el: document.querySelector('.js-municipalities-top'),
  //   data: data.op_municipalities
  // });
  //
  // new AreaStack({
  //   el: document.querySelector('.js-destination-top'),
  //   data: data.top_countries
  // });

  if (data.risk_indicators_municip.rows.length) {
    new Table({
      el: document.querySelector('.js-municipalities-table'),
      data: data.risk_indicators_municip,
      type: 't_head_actors',
      target: 'actor'
    });
  }

  if (data.risk_indicators_biome.rows.length) {
    new Table({
      el: document.querySelector('.js-biome-table'),
      data: data.risk_indicators_biome,
      type: 't_head_actors',
      target: 'actor'
    });
  }
};

const _showErrorMessage = () => {
  const el = document.querySelector('.l-factsheet-actor');
  el.classList.add('-error');
  document.querySelector('.c-loading').classList.add('is-hidden');
  el.querySelector('.content >.wrap').classList.add('is-hidden');
  el.querySelector('.js-error-message').classList.remove('is-hidden');
};

const _init = ()  => {
  const url = window.location.search;
  const urlParams = getURLParams(url);
  const nodeId = urlParams.nodeId;
  const commodity = urlParams.commodity || defaults.commodity;

  const actorFactsheetURL = getURLFromParams(GET_ACTOR_FACTSHEET, { node_id: nodeId});

  fetch(actorFactsheetURL)
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
      document.querySelector('.content >.wrap').classList.remove('is-hidden');

      const data = result.data;

      _setInfo(data.column_name, data.node_name, data.forest_500, data.zero_deforestation);

      const commodityDropdown = new Dropdown('commodity', _onSelect);
      commodityDropdown.setTitle(_.capitalize(commodity));

      _build(data);
    });

  new Nav();


};

_init();
