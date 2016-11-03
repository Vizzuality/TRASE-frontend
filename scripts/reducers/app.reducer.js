import actions from 'actions';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
  isMapLayerVisible: false,
  isMapVisible: false,
  isAppMenuVisible: false,
  modal: {
    visibility: false,
    data: null
  }
};

export default function (state = initialState, action) {
  switch (action.type) {

  case actions.RESIZE:
    return Object.assign({}, state, { windowSize: [action.width, action.height] });

  case actions.TOGGLE_MAP_LAYERS_MENU:
    return Object.assign({}, state, { isMapLayerVisible: !state.isMapLayerVisible });

  case actions.TOGGLE_MAP:
    return Object.assign({}, state, { isMapVisible: !state.isMapVisible });
  case actions.TOGGLE_MODAL_VISIBILITY:
    return Object.assign({}, state, { modal: action.modal });
  default:
    return state;
  }
}
