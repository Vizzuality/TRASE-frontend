import Nav from 'components/nav.component.js';
import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/_foundation.css';
import 'styles/layouts/l-factsheets.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';

import _ from 'lodash';

import Search from 'components/search.component.js';
import { FACT_SHEET_NODE_TYPE_WHITELIST } from 'constants';
import { getURLFromParams, GET_ALL_NODES } from '../utils/getURLFromParams';

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

  const onNodeSelected = function(nodeId, type) {
    let url = '';
    if (type === 'exporter' || type === 'importer') {
      url = `factsheet-actor.html?nodeId=${nodeId}`;
    } else {
      url = `factsheet-place.html?nodeId=${nodeId}`;
    }

    window.location.href = url;
  };

  const allNodesURL = getURLFromParams(GET_ALL_NODES);

  fetch(allNodesURL)
    .then(response => response.json())
    .then((result) => {

      document.querySelector('.js-factsheets-search-container').classList.remove('is-hidden');

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
  new Nav();
};


_init();
