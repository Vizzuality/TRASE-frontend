import actions from 'actions';

const initialState = {
  windowSize: [window.innerWidth, window.innerHeight],
  isMapLayerVisible: false,
  isAppMenuVisible: false,
  tooltipCheck: 0,
  tooltips: [],
  isDisclaimerModalVisible: false
};

const isSankeyExpanded = (state) => state.isMapLayerVisible !== true && state.isMapVisible !== true;

export default function (state = initialState, action) {
  switch (action.type) {

    case actions.SET_SANKEY_SIZE:
      if (isSankeyExpanded(state)) {
        return Object.assign({}, state, {
          sankeySize: [window.innerWidth - 354, window.innerHeight - 160]
        });
      }
      return state;

    case actions.TOGGLE_MAP_LAYERS_MENU:
      return Object.assign({}, state, { isMapLayerVisible: !state.isMapLayerVisible });

    case actions.LOAD_TOOLTIP:
      return Object.assign({}, state, { tooltipCheck: (state.tooltipCheck || 0) + 1 });

    case actions.SET_TOOLTIPS:
      return Object.assign({}, state, { tooltips: action.payload });

    case actions.TOGGLE_DISCLAIMER_MODAL:
      return Object.assign({}, state, { isDisclaimerModalVisible: action.payload });

    case actions.SHOW_DISCLAIMER: {
      return Object.assign({}, state,
        {
          modal: {
            visibility: true,
            modalParams: {
              description: action.disclaimerContent
            }
          }
        });
    }

    default:
      return state;
  }
}
