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

import Nav from 'components/shared/nav.component.js';
import Dropdown from 'components/shared/dropdown.component';
import Map from 'components/profiles/map.component';
import Top from 'components/profiles/top.component';
import Line from 'components/profiles/line.component';
import MultiTable from 'components/profiles/multi-table.component';
import Scatterplot from 'components/profiles/scatterplot.component';
import Tooltip from 'components/profiles/tooltip.component';

import { getURLParams } from 'utils/stateURL';
import smoothScroll from 'utils/smoothScroll';
import formatApostrophe from 'utils/formatApostrophe';
import formatNumber from 'utils/formatNumber';
import _ from 'lodash';
import { getURLFromParams, GET_ACTOR_FACTSHEET } from '../utils/getURLFromParams';

const defaults = {
  country: 'Brazil',
  commodity: 'soy'
};

const _onSelect = function(value) {
  this.setTitle(value);
  defaults[this.id] = value;
};

const _build = (data, nodeId) => {
  const tooltip = new Tooltip('.js-infowindow');

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
        tooltip.showTooltip(x, y, {
          title: `${data.node_name} > ${municipality.properties.nome.toUpperCase()}`,
          values: [
            { title: 'Trade Volume',
              value: 'put choropleth value here' }
          ]
        });
      },
      hideTooltipCallback: () => {
        tooltip.hideTooltip();
      }
    });
  }

  if (data.top_countries.lines.length) {
    document.querySelector('.js-top-map-title').innerHTML = `TOP DESTINATION COUNTRIES Of ${formatApostrophe(_.capitalize(data.node_name))} SOY`;
    let topCountriesLines = data.top_countries;
    topCountriesLines.lines = topCountriesLines.lines.slice(0, 5);
    new Line(
      '.js-top-destination',
      topCountriesLines,
      {
        margin: {top: 10, right: 100, bottom: 25, left: 94},
        height: 244,
        ticks: {
          yTicks: 6,
          yTickPadding: 10,
          yTickFormatType: 'top-location',
          xTickPadding: 15
        },
        showTooltipCallback: (country, x, y) => {
          tooltip.showTooltip(x, y, {
            title: `${data.node_name} > ${country.name.toUpperCase()}, ${country.date.getFullYear()}`,
            values: [
              { title: 'Trade Volume',
                value: `${formatNumber(country.value)}<span>Tons</span>` }
            ]
          });
        },
        hideTooltipCallback: () => {
          tooltip.hideTooltip();
        }
      },
    );

    Map('.js-top-destination-map', {
      topoJSONPath: './vector_layers/WORLD.topo.json',
      topoJSONRoot: 'WORLD',
      useRobinsonProjection: true,
      getPolygonClassName: (/*country*/) => {
        const value = Math.floor(8 * Math.random());
        return `-outline ch-${value}`;
      },
      showTooltipCallback: (country, x, y) => {
        tooltip.showTooltip(x, y, {
          title: `${data.node_name} > ${country.properties.name.toUpperCase()}`,
          values: [
            { title: 'Trade Volume',
              value: 'put choropleth value here' }
          ]
        });
      },
      hideTooltipCallback: () => {
        tooltip.hideTooltip();
      }
    });

  }

  if (data.sustainability.length) {
    new MultiTable({
      el: document.querySelector('.js-sustainability-table'),
      data: data.sustainability,
      tabsTitle: `Sustainability of ${formatApostrophe(data.node_name)} TOP source regions in 2015:`,
      type: 't_head_actors',
      target: 'actor'
    });
  }

  new Scatterplot('.js-companies-exporting', {
      data: data.companies_exporting.companies,
      xDimension: data.companies_exporting.dimensions_x,
      nodeId: nodeId,
      showTooltipCallback: (company, indicator, x, y) => {
        tooltip.showTooltip(x, y, {
          title: company.name,
          values: [
            { title: 'Trade Volume',
              value: `${company.y}<span>t</span>` },
            { title: indicator.name,
              value: `${company.x}<span>${indicator.unit}</span>` }
          ]
        });
      },
      hideTooltipCallback: () => {
        tooltip.hideTooltip();
      }
    }
  );
};

const _setInfo = (info, nodeId) => {
  document.querySelector('.js-name').innerHTML = info.name ? _.capitalize(info.name) : '-';
  document.querySelector('.js-link-button-name').textContent = formatApostrophe(_.capitalize(info.name)) + ' PROFILE';
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

      _build(data, nodeId);
    });

  new Nav();
};

_init();
