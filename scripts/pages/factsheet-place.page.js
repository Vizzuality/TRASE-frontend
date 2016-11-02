import 'whatwg-fetch';

import 'styles/factsheet-place.scss';
import 'styles/_base.scss';
import 'styles/_texts.scss';
import 'styles/components/shared/nav.scss';
import 'styles/components/shared/_footer.scss';

import Line from 'components/graphs/line.component';
import Chord from 'components/graphs/chord.component';
import Top10 from 'components/graphs/top10.component';

const nodeId = location.search.substr(1).replace('nodeId=','');

fetch(`${API_URL}/v1/get_place_node_attributes?node_id=${nodeId}&country=BRAZIL&commodity=SOY`)
  .then(response => response.json())
  .then((data) => {
    _build(data.data);
  });

const _build = data => {
  console.log(data)
  new Line('.js-line', data.trajectory_deforestation, data.trajectory_production);
  new Chord('.js-chord-traders', data.top_traders_matrix, data.top_traders, data.municip_name);
  new Top10(document.querySelector('.js-top10-traders'), 'Top traders', data.top_traders, 4);
  new Top10(document.querySelector('.js-top10-consumers'), 'Top consumers', data.top_consumers);
  new Chord('.js-chord-consumers', data.top_consumers_matrix, data.top_consumers, data.municip_name);
};
