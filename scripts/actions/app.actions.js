import actions from 'actions';

export function resize(width, height) {
  return {
    type: actions.RESIZE,
    width,
    height
  };
}

export function toggleMap() {
  return {
    type: actions.TOGGLE_MAP
  };
}

export function toggleMapLayerMenu() {
  return {
    type: actions.TOGGLE_MAP_LAYERS_MENU
  };
}

export function loadTooltip() {
  return {
    type: actions.LOAD_TOOLTIP
  };
}
