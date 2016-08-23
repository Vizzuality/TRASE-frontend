import actions from 'actions';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
};

export default function (state = initialState, action) {
  switch (action.type) {
  case actions.RESIZE:
    return Object.assign({}, state, { windowSize: [action.width, action.height] });
  default:
    return state;
  }
}
