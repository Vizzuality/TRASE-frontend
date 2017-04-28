import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-profile-actor.scss';
import 'styles/components/shared/button.scss';
import 'styles/components/shared/spinner.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/profiles/area-select.scss';
import 'styles/components/profiles/map.scss';
import 'styles/components/profiles/overall-info.scss';
import 'styles/components/profiles/info.scss';
import 'styles/components/profiles/link-buttons.scss';
import 'styles/components/profiles/error.scss';
import 'styles/components/shared/infowindow.scss';

import Nav from 'components/shared/nav.component.js';
import Dropdown from 'components/shared/dropdown.component';
import Map from 'components/profiles/map.component';
import Top from 'components/profiles/top.component';
import MultiTable from 'components/profiles/multi-table.component';

import { getURLParams } from 'utils/stateURL';
import smoothScroll from 'utils/smoothScroll';
import _ from 'lodash';
import { getURLFromParams, GET_ACTOR_FACTSHEET } from '../utils/getURLFromParams';

const defaults = {
  country: 'Brazil',
  commodity: 'soy'
};

const infowindow = document.querySelector('.js-infowindow');

const _onSelect = function(value) {
  this.setTitle(value);
  defaults[this.id] = value;
};

const _showTooltip = (x, y) => {
  infowindow.style.left = x + 'px';
  infowindow.style.top = y + 'px';
  infowindow.classList.remove('is-hidden');
};

const _hideTooltip = () => {
  infowindow.classList.add('is-hidden');
};

const _build = data => {
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
      topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_MUNICIPALITY.topo.json`,
      topoJSONRoot: `${defaults.country.toUpperCase()}_MUNICIPALITY`,
      getPolygonClassName: (/*municipality*/) => {
        const value = Math.floor(8 * Math.random());
        return `-outline ch-${value}`;
      },
      showTooltipCallback: (municipality, x, y) => {
        _showTooltip(x, y);
        infowindowTitle.innerHTML = `${data.node_name} > ${municipality.properties.nome.toUpperCase()}`;
        infowindowBody.innerHTML = 'put choropleth value here';
      },
      hideTooltipCallback: _hideTooltip
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
      getPolygonClassName: ({ properties }) => {
        const country = data.top_countries.lines.find(country => (properties.name.toUpperCase() === country.name));

        if (country) {
          const value = country.buckets &&  country.buckets.value9 || 0;
          return `-outline ch-${value}`;
        }
        return '-outline ch-0';
      },
      showTooltipCallback: (country, x, y) => {
        _showTooltip(x, y);
        infowindowTitle.innerHTML = `${data.node_name} > ${country.properties.name.toUpperCase()}`;
        infowindowBody.innerHTML = 'put choropleth value here';
      },
      hideTooltipCallback: _hideTooltip
    });

  }

  if (data.sustainability.length) {
    new MultiTable({
      el: document.querySelector('.js-sustainability-table'),
      data: data.sustainability,
      tabsTitle: `Sustainability of ${data.node_name}\'s TOP source regions in 2015:`,
      type: 't_head_actors',
      target: 'actor'
    });
  }
};

const _setInfo = (info, nodeId) => {
  document.querySelector('.js-name').innerHTML =
    document.querySelector('.js-link-button-name').innerHTML =
    info.name ? _.capitalize(info.name) : '-';
  document.querySelector('.js-legend').innerHTML = info.type || '-';
  document.querySelector('.js-country').innerHTML = info.country ? _.capitalize(info.country) : '-';
  if (info.forest_500 > 0) document.querySelector('.js-forest-500-score .circle-icon[data-value="1"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 1) document.querySelector('.js-forest-500-score .circle-icon[data-value="2"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 2) document.querySelector('.js-forest-500-score .circle-icon[data-value="3"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 3) document.querySelector('.js-forest-500-score .circle-icon[data-value="4"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.forest_500 > 4) document.querySelector('.js-forest-500-score .circle-icon[data-value="5"] use').setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#icon-circle-filled');
  if (info.zero_deforestation === 'YES') {
    document.querySelector('.js-zero-deforestation-commitment [data-value="yes"]').classList.remove('is-hidden');
  } else {
    document.querySelector('.js-zero-deforestation-commitment [data-value="no"]').classList.remove('is-hidden');
  }
  document.querySelector('.js-link-map').setAttribute('href', `./flows.html?selectedNodesIds=[${nodeId}]&isMapVisible=true`);
  document.querySelector('.js-link-supply-chain').setAttribute('href', `./flows.html?selectedNodesIds=[${nodeId}]`);
  document.querySelector('.js-summary-text').innerHTML = info.summary ? info.summary : '-';
};

const _setEventListeners = () => {
  smoothScroll(document.querySelectorAll('.js-link-profile'));
};

const _showErrorMessage = () => {
  const el = document.querySelector('.l-factsheet-actor');
  el.classList.add('-error');
  document.querySelector('.js-loading').classList.add('is-hidden');
  el.querySelector('.js-wrap').classList.add('is-hidden');
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

      document.querySelector('.js-loading').classList.add('is-hidden');
      document.querySelector('.js-wrap').classList.remove('is-hidden');

      const data = result.data;
      const info = {
        type: data.column_name,
        name: data.node_name,
        country: data.country_name,
        forest_500: data.forest_500,
        zero_deforestation: data.zero_deforestation,
        summary: data.summary
      };

      _setInfo(info, nodeId);
      _setEventListeners();

      const commodityDropdown = new Dropdown('commodity', _onSelect);
      commodityDropdown.setTitle(_.capitalize(commodity));

      _build(data);
    });

  new Nav();


};

_init();
