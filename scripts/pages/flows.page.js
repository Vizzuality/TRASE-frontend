import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import 'styles/layouts/l-flows.scss';
import 'styles/components/loading.scss';
import SankeyContainer from 'containers/sankey.container';
import ColumnsSelectorContainer from 'containers/columnsSelector.container';
import BasemapOptionsContainer from 'containers/basemap-options.container';
import MapContainer from 'containers/map.container';
import NavContainer from 'containers/nav.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { resize } from 'actions/app.actions';
import { loadInitialData } from 'actions/flows.actions';


// TODO: load from URL params (only flows)
const initialState = {
  app: {},
  flows: {
    selectedCountry: 'brazil',
    selectedCommodity: 'soy',
    selectedYears: [2012, 2014],
    selectedQuant: 'Deforestation risk',
    selectedColor: 1,
    selectedView: 1,
    selectedQual: 'Commodity',
    selectedNodesIds: [],
    selectedColumnsIds: [0, 3, 9, 11]
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



new SankeyContainer(store);
new ColumnsSelectorContainer(store);
new MapContainer(store);
new BasemapOptionsContainer(store);
new NavContainer(store);

store.dispatch(loadInitialData());
store.dispatch(resize(window.innerWidth, window.innerHeight));

window.addEventListener('resize', () => {
  store.dispatch(resize(window.innerWidth, window.innerHeight));
});
