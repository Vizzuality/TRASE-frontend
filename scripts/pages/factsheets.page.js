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

  const onNodeSelected = function(nodeId, type) {
    const factsheetType = (type === 'exporter' || type === 'importer') ? 'actor' : 'place';
    window.location.href = `factsheet-${factsheetType}.html?nodeId=${nodeId}`;
  };

  const allNodesURL = getURLFromParams(GET_ALL_NODES);

  fetch(allNodesURL)
    .then(response => response.json())
    .then((result) => {

      document.querySelector('.js-factsheets-search-container').classList.remove('is-hidden');

      const search = new Search();
      search.onCreated();

      const nodesArray = _.values(result.data).filter(node =>
        node.isUnknown !== true && node.isAggregated !== true && FACT_SHEET_NODE_TYPE_WHITELIST.indexOf(node.type) != -1
      );

      search.callbacks = {
        onNodeSelected
      };

      search.loadNodes(nodesArray);
    });
};

_setSearch();
new Nav();
