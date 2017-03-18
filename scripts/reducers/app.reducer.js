import actions from 'actions';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
  isMapLayerVisible: false,
  isMapVisible: false,
  isAppMenuVisible: false,
  tooltipCheck: 0,
  tooltips: []
};

export default function (state = initialState, action) {
  switch (action.type) {

    case actions.RESIZE:
      return Object.assign({}, state, { windowSize: [action.width, action.height] });

    case actions.TOGGLE_MAP_LAYERS_MENU:
      return Object.assign({}, state, { isMapLayerVisible: !state.isMapLayerVisible });

    case actions.TOGGLE_MAP:
      return Object.assign({}, state, { isMapVisible: !state.isMapVisible });

    case actions.LOAD_TOOLTIP:
      return Object.assign({}, state, { tooltipCheck: (state.tooltipCheck || 0) + 1 });

    case actions.SET_TOOLTIPS:
      return Object.assign({}, state, { tooltips: action.payload });

    default:
      return state;
  }
}
