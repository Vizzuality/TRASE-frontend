import actions from 'actions';

export function resize(width, height) {
  return {
    type: actions.RESIZE,
    width,
    height
  };
}
