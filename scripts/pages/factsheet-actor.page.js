import 'whatwg-fetch';

import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/layouts/l-factsheet-actor.scss';
import 'styles/components/button.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';
import 'styles/components/factsheets/area-select.scss';

import Dropdown from 'components/dropdown.component';
import AreaStack from 'components/graphs/area-stack.component';
import Table from 'components/table/table.component';

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

const defaults = {
  exporter: 'Brazil',
  commodity: 'Soy',
};

const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;
};


const exporterDropdown = new Dropdown('exporter', _onSelect);
const commodityDropdown = new Dropdown('commodity', _onSelect);
new Table('municipalities');

exporterDropdown.setTitle(defaults.exporter);
commodityDropdown.setTitle(defaults.commodity);

_renderAreaStack();
_renderAreaStackSecond();
