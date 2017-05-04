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

import TopSourceTemplate from 'ejs!templates/profiles/top-source-switcher.ejs';

const defaults = {
  country: 'Brazil',
  commodity: 'soy'
};

const tooltip = new Tooltip('.js-infowindow');

const _onSelect = function(value) {
  this.setTitle(value);
  defaults[this.id] = value;
};

const _build = (data, nodeId) => {
  const lineSettings = {
    margin: {top: 10, right: 100, bottom: 25, left: 94},
    height: 244,
    ticks: {
      yTicks: 6,
      yTickPadding: 10,
      yTickFormatType: 'top-location',
      xTickPadding: 15
    },
    showTooltipCallback: (location, x, y) => {
      tooltip.showTooltip(x, y, {
        title: `${data.node_name} > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`,
        values: [
          { title: 'Trade Volume',
            value: formatNumber(location.value),
            unit: 'Tons'
          }
        ]
      });
    },
    hideTooltipCallback: () => {
      tooltip.hideTooltip();
    }
  };

  if (data.top_sources.municipality.lines.length) {
    _setTopSourceSwitcher(data);
    let topMunicipalitiesLines = data.top_sources.municipality;
    topMunicipalitiesLines.lines = topMunicipalitiesLines.lines.slice(0, 5);
    new Line(
      '.js-top-municipalities',
      topMunicipalitiesLines,
      data.top_sources.included_years,
      Object.assign({}, lineSettings, {margin: {top: 10, right: 100, bottom: 25, left: 37}}),
    );

    Map('.js-top-municipalities-map', {
      topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_MUNICIPALITY.topo.json`,
      topoJSONRoot: `${defaults.country.toUpperCase()}_MUNICIPALITY`,
      getPolygonClassName: ({ properties }) => {
        const municipality = data.top_sources.municipality.lines
          .find(m => (properties.geoid === m.geo_id));
        let value = 0;
        if (municipality) value = municipality.value9 || 0;
        return `-outline ch-${value}`;
      },
      showTooltipCallback: ({ properties }, x, y) => {
        const municipality = data.top_sources.municipality.lines
          .find(m => (properties.geoid === m.geo_id));
        let title = `${data.node_name} > ${properties.nome.toUpperCase()}`;
        let body = null;
        if (municipality) body = municipality.values[0];

        tooltip.showTooltip(x, y, {
          title,
          values: [{
            title: 'Trade Volume',
            value: formatNumber(body),
            unit: 'Tons'
          }]
        });
      },
      hideTooltipCallback: () => {
        tooltip.hideTooltip();
      }
    });
  }

  if (data.top_countries.lines.length) {
    document.querySelector('.js-top-map-title').innerHTML = `Top destination countries of ${formatApostrophe(_.capitalize(data.node_name))} soy`;
    let topCountriesLines = data.top_countries;
    topCountriesLines.lines = topCountriesLines.lines.slice(0, 5);
    new Line(
      '.js-top-destination',
      topCountriesLines,
      data.top_countries.included_years,
      lineSettings,
    );

    Map('.js-top-destination-map', {
      topoJSONPath: './vector_layers/WORLD.topo.json',
      topoJSONRoot: 'WORLD',
      useRobinsonProjection: true,
      getPolygonClassName: ({ properties }) => {
        const country = data.top_countries.lines
          .find(c => (properties.name.toUpperCase() === c.name.toUpperCase()));
        let value = 0;
        if (country) value = country.value9 || 0;
        return `-outline ch-${value}`;
      },
      showTooltipCallback: ({ properties }, x, y) => {
        const country = data.top_countries.lines
          .find(c => (properties.name.toUpperCase() === c.name.toUpperCase()));
        let title = `${data.node_name} > ${properties.name.toUpperCase()}`;
        let body = null;
        if (country) body = country.values[0];

        tooltip.showTooltip(x, y, {
          title,
          values: [{
            title: 'Trade Volume',
            value: formatNumber(body),
            unit: 'Tons'
          }]
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
      tabsTitle: `Sustainability of ${formatApostrophe(data.node_name)} top source regions in 2015:`,
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
          {
            title: 'Trade Volume',
            value: company.y,
            unit: 't'
          },
          {
            title: indicator.name,
            value: company.x,
            unit: indicator.unit
          }
        ]
      });
    },
    hideTooltipCallback: () => {
      tooltip.hideTooltip();
    }
  });
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

const _setTopSourceSwitcher = (data) => {
  const template = TopSourceTemplate({
    nodeName: formatApostrophe(_.capitalize(data.node_name)),
    switchers: Object.keys(data.top_sources).filter(key => key !== 'includedYears')
  });
  document.querySelector('.js-top-municipalities-title').innerHTML = template;

  const switchers = Array.prototype.slice.call(document.querySelectorAll('.js-top-source-switcher'), 0);
  switchers.forEach(switcher => {
    switcher.addEventListener('click', (e) => _switchTopSource(e, data));
  });
};

const _switchTopSource = (e, data) => {
  const selectedSwitch = e && e.currentTarget;
  if (!selectedSwitch) {
    return;
  }

  const selectedSource = selectedSwitch.getAttribute('data-key');
  const switchers = Array.prototype.slice.call(document.querySelectorAll('.js-top-source-switcher'), 0);
  switchers.forEach(switcher => {
    switcher.classList.remove('selected');
  });
  selectedSwitch.classList.add('selected');

  let topMunicipalitiesLines = data.top_sources[selectedSource];
  topMunicipalitiesLines.lines = topMunicipalitiesLines.lines.slice(0, 5);
  new Line(
    '.js-top-municipalities',
    topMunicipalitiesLines,
    data.top_sources.includedYears,
    {
      margin: {top: 10, right: 100, bottom: 25, left: 37},
      height: 244,
      ticks: {
        yTicks: 6,
        yTickPadding: 10,
        yTickFormatType: 'top-location',
        xTickPadding: 15
      },
      showTooltipCallback: (location, x, y) => {
        tooltip.showTooltip(x, y, {
          title: `${data.node_name} > ${location.name.toUpperCase()}, ${location.date.getFullYear()}`,
          values: [
            { title: 'Trade Volume',
              value: `${formatNumber(location.value)}<span>Tons</span>` }
          ]
        });
      },
      hideTooltipCallback: () => {
        tooltip.hideTooltip();
      }
    },
  );

  document.querySelector('.js-top-municipalities-map').innerHTML = '';
  Map('.js-top-municipalities-map', {
    topoJSONPath: `./vector_layers/${defaults.country.toUpperCase()}_${selectedSource.toUpperCase()}.topo.json`,
    topoJSONRoot: `${defaults.country.toUpperCase()}_${selectedSource.toUpperCase()}`,
    getPolygonClassName: ({ properties }) => {
      const municipality = data.top_sources.municipality.lines
        .find(m => (properties.geoid === m.geo_id));
      let value = 0;
      if (municipality) value = municipality.value9 || 0;
      return `-outline ch-${value}`;
    },
    showTooltipCallback: ({ properties }, x, y) => {
      const municipality = data.top_sources.municipality.lines
        .find(m => (properties.geoid === m.geo_id));
      let title = `${data.node_name} > ${properties.nome.toUpperCase()}`;
      let body = null;
      if (municipality) body = municipality.values[0];

      tooltip.showTooltip(x, y, {
        title,
        values: [{
          title: 'Trade Volume',
          value: formatNumber(body),
          unit: 'Tons'
        }]
      });
    },
    hideTooltipCallback: () => {
      tooltip.hideTooltip();
    }
  });
};

const _init = ()  => {
  const url = window.location.search;
  const urlParams = getURLParams(url);
  const nodeId = urlParams.nodeId;
  const commodity = urlParams.commodity || defaults.commodity;

  const actorFactsheetURL = getURLFromParams(GET_ACTOR_FACTSHEET, { node_id: nodeId }, true);

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
