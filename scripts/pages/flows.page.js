import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import FlowContentContainer from 'containers/flow-content.container';
import SankeyContainer from 'containers/sankey.container';
import ColumnsSelectorContainer from 'containers/columns-selector.container';
import MapVariablesContainer from 'containers/map-variables.container';
import MapContextContainer from 'containers/map-context.container';
import MapLegendContainer from 'containers/map-legend.container';
import MapContainer from 'containers/map.container';
import NavContainer from 'containers/nav.container';
import TitlebarContainer from 'containers/titlebar.container';
import NodesTitlesContainer from 'containers/nodesTitles.container';
import ClearContainer from 'containers/clear.container';
import SearchContainer from 'containers/search.container';
import ModalContainer from 'containers/shared/modal.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { resize } from 'actions/app.actions';
import { loadInitialData } from 'actions/flows.actions';
import { getURLParams, decodeStateFromURL } from 'utils/stateURL';
import { APP_DEFAULT_STATE, FLOWS_DEFAULT_STATE } from 'constants';

import 'styles/layouts/l-flows.scss';
import 'styles/components/loading.scss';

const objParams = getURLParams(window.location.search);

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

  new FlowContentContainer(store);
  new SankeyContainer(store);
  new ColumnsSelectorContainer(store);
  new MapContainer(store);
  new MapVariablesContainer(store);
  new MapContextContainer(store);
  new MapLegendContainer(store);
  new NavContainer(store);
  new TitlebarContainer(store);
  new NodesTitlesContainer(store);
  new ClearContainer(store);
  new SearchContainer(store);
  new ModalContainer(store);

  store.dispatch(loadInitialData());
  store.dispatch(resize(window.innerWidth, window.innerHeight));

  window.addEventListener('resize', () => {
    store.dispatch(resize(window.innerWidth, window.innerHeight));
  });
};


if (objParams.story) {

  // TODO display loading state while loading service

  const storyId = objParams.story;

  fetch(`${API_STORY_CONTENT}/${storyId}`)
    .then(resp => resp.text())
    .then(resp => JSON.parse(resp))
    .then(modalParams => {

      modalState = {
        visibility: true,
        modalParams
      };

      Object.assign(APP_DEFAULT_STATE.app, { modal: modalState });

      if (objParams.state) {
        const newState = decodeStateFromURL(objParams.state);
        Object.assign(FLOWS_DEFAULT_STATE.flows, newState);
      }

      const globalState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);

      start(globalState);
    })
    // if the API call fails, let the app flow continues
    .catch(() => {

      if (objParams.state) {
        const newState = decodeStateFromURL(objParams.state);
        Object.assign(FLOWS_DEFAULT_STATE.flows, newState);
      }

      const globalState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);
      start(globalState);
    });

} else {

  Object.assign(APP_DEFAULT_STATE.app, { modal: modalState });

  if (objParams.state) {
    const newState = decodeStateFromURL(objParams.state);
    Object.assign(FLOWS_DEFAULT_STATE.flows, newState);
  }

  const globalState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);

  start(globalState);
}
