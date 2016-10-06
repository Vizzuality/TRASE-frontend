import actions from 'actions';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
  isMapLayerVisible: false
};

export default function (state = initialState, action) {
  switch (action.type) {

  case actions.RESIZE:
    return Object.assign({}, state, { windowSize: [action.width, action.height] });

  case actions.TOGGLE_MAP_LAYERS_MENU:
    return Object.assign({}, state, { isMapLayerVisible: !state.isMapLayerVisible });

  default:
    return state;
  }
}
