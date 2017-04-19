import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profile-actor.scss';
import 'styles/components/shared/button.scss';
import 'styles/components/shared/loading.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/profiles/area-select.scss';
import 'styles/components/profiles/map.scss';
import 'styles/components/profiles/info.scss';
import 'styles/components/profiles/error.scss';
import 'styles/components/shared/loading.scss';
import 'styles/components/shared/infowindow.scss';

import Nav from 'components/shared/nav.component.js';
import Dropdown from 'components/shared/dropdown.component';
import Map from 'components/profiles/map.component';
import Top from 'components/profiles/top.component';
import Table from 'components/profiles/table.component';

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

const _build = data => {
  const countryName = 'BRAZIL';

  const infowindow = document.querySelector('.js-infowindow');
  const infowindowTitle = document.querySelector('.js-infowindow-title');
  const infowindowBody = document.querySelector('.js-infowindow-body');

  if (data.top_sources.municipalities.lines.length) {
    new Top({
      el: document.querySelector('.js-top-municipalities'),
      data: data.top_sources.municipalities.lines,
      targetLink: 'place',
      title: 'top source municipalities in 2015'
    });

    Map('.js-top-municipalities-map', {
      topoJSONPath: `./vector_layers/${countryName}_MUNICIPALITY.topo.json`,
      topoJSONRoot: `${countryName}_MUNICIPALITY`,
      getPolygonClassName: (/*municipality*/) => {
        const value = Math.floor(8 * Math.random());
        return `-outline ch-${value}`;
      },
      showTooltipCallback: (municipality, x, y) => {
        console.warn(municipality.properties);
        infowindow.style.left = x + 'px';
        infowindow.style.top = y + 'px';
        infowindow.classList.remove('is-hidden');
        infowindowTitle.innerHTML = 'pouet';
        infowindowBody.innerHTML = 'put choropleth value here';
      },
      hideTooltipCallback: () => {
        infowindow.classList.add('is-hidden');
      }
    });
  }

  if (data.top_countries.lines.length) {
    new Top({
      el:document.querySelector('.js-top-destination'),
      data: data.top_countries.lines,
      title: 'top destination countries in 2015'
    });

    Map('.js-top-destination-map', {
      topoJSONPath: './vector_layers/WORLD.topo.json',
      topoJSONRoot: 'WORLD',
      useRobinsonProjection: true,
      getPolygonClassName: (country) => {
        console.warn(country.properties.name, country.properties.iso2);
        const value = Math.floor(8 * Math.random());
        return `-outline ch-${value}`;
      },
      showTooltipCallback: (country, x, y) => {
        infowindow.style.left = x + 'px';
        infowindow.style.top = y + 'px';
        infowindow.classList.remove('is-hidden');
        infowindowTitle.innerHTML = `${data.node_name} > ${country.properties.name.toUpperCase()}`;
        infowindowBody.innerHTML = 'put choropleth value here';
      },
      hideTooltipCallback: () => {
        infowindow.classList.add('is-hidden');
      }
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

  if (data.sustainability.municipalities.rows.length) {
    new Table({
      el: document.querySelector('.js-municipalities-table'),
      data: data.sustainability.municipalities,
      type: 't_head_actors',
      target: 'actor'
    });
  }

  if (data.sustainability.biome.rows.length) {
    new Table({
      el: document.querySelector('.js-biome-table'),
      data: data.sustainability.biome,
      type: 't_head_actors',
      target: 'actor'
    });
  }
};

const _setInfo = (type, name, forest_500, zero_deforestation, nodeId) => {
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
  document.querySelector('.js-link-map').setAttribute('href', `./flows.html?selectedNodesIds=[${nodeId}]&isMapVisible=true`);
  document.querySelector('.js-link-supply-chain').setAttribute('href', `./flows.html?selectedNodesIds=[${nodeId}]`);
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

  const actorFactsheetURL = getURLFromParams(GET_ACTOR_FACTSHEET, { node_id: nodeId}, true);

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

      _setInfo(data.column_name, data.node_name, data.forest_500, data.zero_deforestation, nodeId);

      const commodityDropdown = new Dropdown('commodity', _onSelect);
      commodityDropdown.setTitle(_.capitalize(commodity));

      _build(data);
    });

  new Nav();


};

_init();
