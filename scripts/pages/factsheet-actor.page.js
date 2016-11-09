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
import Search from 'components/search.component.js';

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

const parseNode = (node) => {
  return {
    label: node.name.toLowerCase(),
    value: JSON.stringify({
      id: node.id,
      name: node.name.toLowerCase(),
      columnName: node.type.toLowerCase()
    })
  };
};


fetch('http://traseplatform.org/api/v1/get_all_nodes?&country=brazil&commodity=soy')
  .then(response => response.json())
  .then((result) => {
    const search = new Search();
    search.onCreated();

    search.autocomplete.data = parseNode;
    search.loadNodes(result.data);
    search.callbacks = {};
    search.callbacks.onNodeSelected = function() {
      let url = null;
      const nodeId = parseInt(JSON.parse(event.text.value).id);
      const type = JSON.parse(event.text.value).columnName;

      if (type === 'municipality'
        || type === 'biomes'
        || type === 'state') {

        url = `factsheet-place.html?nodeId=${nodeId}`;
      }

      if (type === 'exporter' || type === 'importer') {
        url = `factsheets.html?nodeId=${nodeId}`;
      }

      if (!url) return;

      window.location.href = url;
    };

  });

const exporterDropdown = new Dropdown('exporter', _onSelect);
const commodityDropdown = new Dropdown('commodity', _onSelect);
new Table('municipalities');

exporterDropdown.setTitle(defaults.exporter);
commodityDropdown.setTitle(defaults.commodity);

_renderAreaStack();
_renderAreaStackSecond();
