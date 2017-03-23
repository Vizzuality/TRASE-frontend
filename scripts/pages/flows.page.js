import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import FlowContentContainer from 'containers/flow-content.container';
import SankeyContainer from 'containers/sankey.container';
import ColumnsSelectorContainer from 'containers/columns-selector.container';
import MapDimensionsContainer from 'containers/map-dimensions.container.js';
import MapContextContainer from 'containers/map-context.container';
import MapLegendContainer from 'containers/map-legend.container';
import MapBasemapsContainer from 'containers/map-basemaps.container';
import MapContainer from 'containers/map.container';
import NavContainer from 'containers/nav-flows.container';
import NavContainer2 from 'containers/nav-flows-react.container';
import TitlebarContainer from 'containers/titlebar.container';
import NodesTitlesContainer from 'containers/nodesTitles.container';
import SearchContainer from 'containers/search.container';
import ModalContainer from 'containers/story-modal.container';
import TooltipContainer from 'containers/tooltip.container';
import AppReducer from 'reducers/app.reducer';
import FlowsReducer from 'reducers/flows.reducer';
import { resize, loadDisclaimer } from 'actions/app.actions';
import { loadInitialData } from 'actions/flows.actions';
import { getURLParams, decodeStateFromURL } from 'utils/stateURL';
import { APP_DEFAULT_STATE, FLOWS_DEFAULT_STATE } from 'constants';
import 'styles/layouts/l-flows.scss';
import 'styles/components/loading.scss';

const objParams = getURLParams(window.location.search);

const start = () => {
  if (objParams.state) {
    const newState = decodeStateFromURL(objParams.state);
    Object.assign(FLOWS_DEFAULT_STATE.flows, newState);
  }

  const initialState = Object.assign({}, FLOWS_DEFAULT_STATE, APP_DEFAULT_STATE);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  var store = createStore(combineReducers({
    app: AppReducer,
    flows: FlowsReducer
  }), initialState, composeEnhancers(applyMiddleware(thunk)));

  new FlowContentContainer(store);
  new SankeyContainer(store);
  new ColumnsSelectorContainer(store);
  new MapContainer(store);
  new MapDimensionsContainer(store);
  new MapContextContainer(store);
  new MapLegendContainer(store);
  new MapBasemapsContainer(store);
  new NavContainer(store);
  new NavContainer2(store);
  new TitlebarContainer(store);
  new NodesTitlesContainer(store);
  new SearchContainer(store);
  new TooltipContainer(store);
  new ModalContainer(store);

  store.dispatch(loadDisclaimer());
  store.dispatch(loadInitialData());
  store.dispatch(resize());

  window.addEventListener('resize', () => {
    store.dispatch(resize());
  });
};

if (objParams.story) {
  // TODO display loading state while loading service

  const storyId = objParams.story;

  fetch(`${API_STORY_CONTENT}/${storyId}`)
    .then(resp => resp.text())
    .then(resp => JSON.parse(resp))
    .then(modalParams => {
      Object.assign(APP_DEFAULT_STATE.app, {
        modal: {
          visibility: true,
          modalParams
        }
      });

      start();
    })
    .catch(() => {
      start();
    });

} else {
  start();
}

if (NODE_ENV_DEV === true) {
  window.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
      // reload without the hash
      window.location.href = './flows.html';
    }
  });
}
