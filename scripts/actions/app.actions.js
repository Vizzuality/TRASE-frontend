import actions from 'actions';

export function resize() {
  return {
    type: actions.SET_SANKEY_SIZE
  };
}

export function toggleMap() {
  return (dispatch) => {
    dispatch({
      type: actions.TOGGLE_MAP
    });
    dispatch({ type: actions.SET_SANKEY_SIZE });
  };
}

export function toggleMapLayerMenu() {
  return (dispatch) => {
    dispatch({
      type: actions.TOGGLE_MAP_LAYERS_MENU
    });
    dispatch({ type: actions.SET_SANKEY_SIZE });
  };
}

export function loadTooltip() {
  return {
    type: actions.LOAD_TOOLTIP
  };
}
