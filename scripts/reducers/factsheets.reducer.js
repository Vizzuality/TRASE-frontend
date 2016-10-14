import actions from 'actions';

// TODO: set a proper initialState
const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {

  case actions.SELECT_COMMODITY_AREA_STACK:
    return Object.assign({}, state, { commodity: action.commodity });

  default:
    return state;
  }
}
