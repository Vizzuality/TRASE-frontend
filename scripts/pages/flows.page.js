import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import 'styles/layouts/l-flows.scss';
import 'styles/components/loading.scss';
import FlowContentContainer from 'containers/flow-content.container';
import SankeyContainer from 'containers/sankey.container';
import ColumnsSelectorContainer from 'containers/columns-selector.container';
import MapLayersContainer from 'containers/map-layers.container';
import MapLegendContainer from 'containers/map-legend.container';
import MapContainer from 'containers/map.container';
import NavContainer from 'containers/nav.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { resize } from 'actions/app.actions';
import { loadInitialData } from 'actions/flows.actions';


// TODO: load from URL params (only flows)
const initialState = {
  flows: {
    selectedCountry: 'brazil',
    selectedCommodity: 'soy',
    selectedYears: [2012, 2014],
    selectedQuant: 'Deforestation risk',
    selectedColor: 1,
    selectedView: 1,
    selectedQual: 'Commodity',
    selectedNodesIds: [],
    selectedColumnsIds: [0, 3, 9, 11],
    selectedVectorLayers: {
      horizontal: {
        layerSlug: null,
        title: null
      },
      vertical: {
        layerSlug: 'deforestation',
        title: 'Deforestation'
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
new MapLegendContainer(store);
new NavContainer(store);

store.dispatch(loadInitialData());
store.dispatch(resize(window.innerWidth, window.innerHeight));

window.addEventListener('resize', () => {
  store.dispatch(resize(window.innerWidth, window.innerHeight));
});
