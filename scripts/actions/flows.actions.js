import actions from 'actions';

export function selectIndicator(indicator) {
  return {
    type: actions.SELECT_INDICATOR,
    indicator
  };
}
