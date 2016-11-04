import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import 'whatwg-fetch';



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
import SearchContainer from 'containers/search.container';
import ModalContainer from 'containers/shared/modal.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { resize } from 'actions/app.actions';
import { loadInitialData } from 'actions/flows.actions';
import { getStateFromURLHash } from 'utils/stateURL';
import { APP_DEFAULT_STATE, FLOWS_DEFAULT_STATE } from 'constants';

import 'styles/layouts/l-flows.scss';
import 'styles/components/loading.scss';

const paramsURL = window.location.search.slice(1).split('=');

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
  new MapLayersContainer(store);
  new MapContextContainer(store);
  new MapLegendContainer(store);
  new NavContainer(store);
  new TitlebarContainer(store);
  new NodesTitlesContainer(store);
  new SearchContainer(store);
  new ModalContainer(store);

  store.dispatch(loadInitialData());
  store.dispatch(resize(window.innerWidth, window.innerHeight));

  window.addEventListener('resize', () => {
    store.dispatch(resize(window.innerWidth, window.innerHeight));
  });
};

if (paramsURL[0] === 'story') {
  // load config JSON
  // TODO move mockup to real service
  // TODO display loading state while loading service
  const storyId = paramsURL[1];

  fetch(`${API_STORY_CONTENT}/${storyId}`)
    .then(resp => resp.text())
    .then(resp => JSON.parse(resp))
    .then(modalParams => {

      const modalState = {
        visibility: true,
        modalParams
      };

      // TODO get real state hash
      // start(getStateFromURLHash(data.state));

      Object.assign(APP_DEFAULT_STATE.app, { modal: modalState });
      const globalState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);

      start(globalState);
    });
} else if (paramsURL[0] === 'state') {
  // load app from state
  start(getStateFromURLHash(paramsURL[1]));
} else {
  const globalState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);
  start(globalState);
}
