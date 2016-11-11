import 'whatwg-fetch';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/layouts/l-factsheet-actor.scss';
import 'styles/components/button.scss';
import 'styles/components/loading.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/factsheets/area-select.scss';
import 'styles/components/factsheets/info.scss';
import 'styles/components/factsheets/error.scss';
import 'styles/components/loading.scss';

import Dropdown from 'components/dropdown.component';
// import AreaStack from 'components/graphs/area-stack.component';  stack area future
import Table from 'components/table/table.component';

import { getURLParams } from 'utils/stateURL';
import _ from 'lodash';

const defaults = {
  commodity: 'soy',
};

const _onSelect = function(value) {
  this.setTitle(value);
  defaults[this.id] = value;
};

const _setInfo = (type, name) => {
  document.querySelector('.js-legend').innerHTML = type || '-';
  document.querySelector('.js-name').innerHTML = name ? _.capitalize(name) : '-';
};

const _build = data => {
  // new AreaStack({
  //   el: document.querySelector('.js-municipalities-top'),
  //   data: data.op_municipalities
  // });
  //
  // new AreaStack({
  //   el: document.querySelector('.js-destination-top'),
  //   data: data.top_countries
  // });

  new Table({
    el:document.querySelector('.js-municipalities-table'),
    data: data.risk_indicators_municip,
    type: 't_head_actors',
    target: 'actor'
  });


  new Table({
    el:document.querySelector('.js-municipalities-top'),
    data: data.top_municipalities,
    type: 'top_municipalities',
    target: 'place'
  });

  new Table({
    el:document.querySelector('.js-destination-top'),
    data: data.top_countries,
    type: 'top_destination'
  });
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


  fetch(`${API_URL}/v1/get_actor_node_attributes?node_id=${nodeId}&country=Brazil&commodity=soy`)
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

      _setInfo(data.column_name, data.node_name);

      const commodityDropdown = new Dropdown('commodity', _onSelect);
      commodityDropdown.setTitle(_.capitalize(commodity));

      _build(data);
    });

};

_init();
