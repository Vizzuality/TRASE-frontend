import actions from 'actions';

export function selectCommodity(commodity) {
  return {
    type: actions.SELECT_COMMODITY_AREA_STACK,
    commodity
  };
}
