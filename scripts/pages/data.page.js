import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import DataContentContainer from 'containers/data-content.container';
import Nav from 'components/nav.component.js';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { loadContext } from 'actions/data.actions';
import { APP_DEFAULT_STATE, FLOWS_DEFAULT_STATE } from 'constants';

import 'styles/data.scss';

let modalState = {
  visibility: false,
  modalParams: null
};

const start = (initialState) => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  var store = createStore(
    combineReducers({
      app: AppReducer,
      flows: FlowsReducer
    }),
    initialState,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  );

  new DataContentContainer(store);

  store.dispatch(loadContext());
};

Object.assign(APP_DEFAULT_STATE.app, { modal: modalState });

const globalState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);

start(globalState);

const nav = new Nav();
nav.onCreated();
