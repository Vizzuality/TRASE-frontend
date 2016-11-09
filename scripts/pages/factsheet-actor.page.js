import 'whatwg-fetch';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/layouts/l-factsheet-actor.scss';
import 'styles/components/button.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/factsheets/area-select.scss';
import 'styles/components/factsheets/info.scss';

import Dropdown from 'components/dropdown.component';
import AreaStack from 'components/graphs/area-stack.component';
import Table from 'components/table/table.component';

import { getUrlParams } from 'utils/stateURL';
import _ from 'lodash';

const defaults = {
  commodity: 'soy',
};

const _renderAreaStack = () => {
  const el = document.querySelector('.js-municipalities-top');

  new AreaStack({
    el
  });
};

const _renderAreaStackSecond = () => {
  const el = document.querySelector('.js-destination-top');

  new AreaStack({
    el
  });
};

const _renderTable = () => {
  new Table('municipalities');
};

const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;
};

const _setInfo = (type, name) => {
  document.querySelector('.js-legend').innerHTML = type || '-';
  document.querySelector('.js-name').innerHTML = name ? _.capitalize(name) : '-';
};

const _init = ()  => {
  const url = window.location.search;
  const urlParams = getUrlParams(url);
  const nodeId = urlParams.nodeId;
  const commodity = urlParams.commodity || defaults.commodity;


  fetch(`${API_URL}/v1/get_actor_node_attributes?node_id=${nodeId}&country=Brazil&commodity=soy`)
    .then(response => response.json())
    .then((result) => {
      const data = result.data;
      _setInfo(data.column_name, data.municip_name);

      const commodityDropdown = new Dropdown('commodity', _onSelect);
      commodityDropdown.setTitle(_.capitalize(commodity));

      _renderAreaStack();
      _renderAreaStackSecond();
      _renderTable();
    });

};

_init();
