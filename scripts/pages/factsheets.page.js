
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import IndexContainer from 'containers/factsheets/index.container';

import AppReducer from 'reducers/app.reducer';
import FactsheetsReducer from 'reducers/factsheets.reducer';

import 'styles/factsheets.scss';

// TODO: set proper initialState
const initialState = {};

const store = createStore(
  combineReducers({
    app: AppReducer,
    factsheets: FactsheetsReducer
  }),
  initialState,
  applyMiddleware(thunk)
);

new IndexContainer(store);
