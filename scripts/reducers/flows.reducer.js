import actions from 'actions';

export default function (state = {}, action) {
  switch (action.type) {
  case actions.GET_DATA:
    return Object.assign({}, state, { payload: action.payload });
  case actions.HIGHLIGHT_NODE:
    return Object.assign({}, state, { highlightedNodeId: action.id });
  case actions.SELECT_NODE:
    return Object.assign({}, state, { selectedNodeId: state.highlightedNodeId });
  case actions.SELECT_INDICATOR:
    return Object.assign({}, state, { selectedIndicator: action.indicator });
  case actions.SELECT_COUNTRY:
    return Object.assign({}, state, { selectedCountry: action.country });
  default:
    return state;
  }
}
