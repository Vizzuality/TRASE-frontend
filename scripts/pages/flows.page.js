import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import FlowContentContainer from 'containers/flow-content.container';
import SankeyContainer from 'containers/sankey.container';
import ColumnsSelectorContainer from 'containers/columns-selector.container';
import MapLayersContainer from 'containers/map-layers.container';
import MapContextContainer from 'containers/map-context.container';
import MapLegendContainer from 'containers/map-legend.container';
import MapContainer from 'containers/map.container';
import NavContainer from 'containers/nav.container';
import TitlebarContainer from 'containers/titlebar.container';
import NodesTitlesContainer from 'containers/nodesTitles.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { resize } from 'actions/app.actions';
import { loadInitialData } from 'actions/flows.actions';

import 'styles/layouts/l-flows.scss';
import 'styles/components/loading.scss';


// TODO: load from URL params (only flows)
const initialState = {
  flows: {
    selectedCountry: 'brazil',
    selectedCommodity: 'soy',
    selectedYears: [2012, 2014],
    selectedQuant: 'Deforestation risk',
    selectedView: 1,
    selectedQual: 'none',
    selectedNodesIds: [],
    selectedColumnsIds: [2, 3, 5, 6],
    selectedVectorLayers: {
      horizontal: {
        uid: null,
        title: null
      },
      vertical: {
        uid: null,
        title: null
      }
    },
    selectedContextualLayers: ['soy_infrastructure', 'land_conflicts']
  }
};


var store = createStore(
  combineReducers({
    app: AppReducer,
    flows: FlowsReducer
  }),
  initialState,
  applyMiddleware(thunk)
);



new FlowContentContainer(store);
new SankeyContainer(store);
new ColumnsSelectorContainer(store);
new MapContainer(store);
new MapLayersContainer(store);
new MapContextContainer(store);
new MapLegendContainer(store);
new NavContainer(store);
new TitlebarContainer(store);
new NodesTitlesContainer(store);

store.dispatch(loadInitialData());
store.dispatch(resize(window.innerWidth, window.innerHeight));

window.addEventListener('resize', () => {
  store.dispatch(resize(window.innerWidth, window.innerHeight));
});
