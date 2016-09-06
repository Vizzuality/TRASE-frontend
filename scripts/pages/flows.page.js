import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import 'styles/layouts/l-flows.scss';
import 'styles/components/chord.scss';
import 'styles/components/timeline.scss';
import SankeyContainer from 'containers/sankey.container';
import MapContainer from 'containers/map.container';
import NavContainer from 'containers/nav.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import {resize} from 'actions/app.actions';
import {selectIndicator} from 'actions/flows.actions';


var store = createStore(
  combineReducers({
    app: AppReducer,
    flows: FlowsReducer
  }),
  applyMiddleware(thunk)
);

window.addEventListener('resize', () => {
  store.dispatch(resize(window.innerWidth, window.innerHeight));
});

new SankeyContainer(store);
new MapContainer(store);
new NavContainer(store);

store.dispatch(selectIndicator('trade'));
