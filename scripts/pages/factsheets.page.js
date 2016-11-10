import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/layouts/l-factsheets.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';


import 'whatwg-fetch';
import _ from 'lodash';

import Search from 'components/search.component.js';
import { FACT_SHEET_NODE_TYPE_WHITELIST } from 'constants';

const _setSearch = () => {

  const loadNodes = function(nodesDict) {
    const nodesArray = _.values(nodesDict).filter(node =>
      node.isUnknown !== true && node.isAggregated !== true && FACT_SHEET_NODE_TYPE_WHITELIST.indexOf(node.type) != -1
    );

    this.autocomplete.list = nodesArray;
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

  const onNodeSelected =function() {
    let url = '';
    const nodeId = parseInt(JSON.parse(event.text.value).id);
    const type = JSON.parse(event.text.value).columnName;

    if (type === 'exporter' || type === 'importer') {
      url = `factsheet-actor.html?nodeId=${nodeId}`;
    } else {
      url = `factsheet-place.html?nodeId=${nodeId}`;
    }

    window.location.href = url;
  };

  fetch(`${API_URL}/v1/get_all_nodes?&country=brazil&commodity=soy`)
    .then(response => response.json())
    .then((result) => {

      document.querySelector('.js-search-container').classList.remove('is-hidden');

      const search = new Search();
      search.onCreated();

      search.autocomplete.data = parseNode;
      loadNodes.apply(search, [result.data]);
      search.callbacks = {};
      search.callbacks.onNodeSelected = onNodeSelected;
    });
};

const _init = () => {
  _setSearch();
};

_init();
