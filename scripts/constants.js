import actions from 'actions';

// flows
export const NUM_COLUMNS = 4;
export const NUM_NODES_SUMMARY = 10;
export const NUM_NODES_EXPANDED = 100;
export const NUM_NODES_DETAILED = 999;
export const DETAILED_VIEW_SCALE = 1200;
export const DETAILED_VIEW_MIN_NODE_HEIGHT = 14;
export const DETAILED_VIEW_MIN_LINK_HEIGHT = 1;
export const AVAILABLE_YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016];
export const LEGEND_COLORS = {
  bidimensional: [
    '#8db6ca', '#8f8d94', '#694d52',
    '#aadad1', '#a8bebf', '#a15661',
    '#f5f3ea', '#f6c7ad', '#f65e6e'], //9
  horizontal: ['#f5f3ea', '#f5dfd0', '#f6c7ad', '#fa898d', '#f65e6e'], // 5
  vertical: ['#F4F1E7', '#C8E1D8', '#A0D5CB', '#87B3C0', '#7297AA'], // 5
  error_no_metadata: '#c7c7c7',
  error_no_metadata_for_layer: '#c7c7c7',
};

export const NODE_SELECTION_LINKS_NUM_COLORS = 3;


export const APP_DEFAULT_STATE = {
  app: {
    modal: {
      visibility: false,
      modalParams: null
    }
  }
};

export const FLOWS_DEFAULT_STATE = {
  flows: {
    selectedCountry: 'brazil',
    selectedCommodity: 'soy',
    selectedYears: [2015, 2015],
    selectedQuant: 'volume',
    detailedView: false,
    // TODO value_type should be inferred from the value, not kept in state
    selectedRecolorBy: { value: 'none', value_type: 'none' },
    selectedBiomeFilter: 'none',
    selectedNodesIds: [],
    expandedNodesIds: [],
    selectedNodesColorGroups: [],
    areNodesExpanded: false,
    selectedNodesData: [],
    selectedColumnsIds: [3, 4, 6, 7],
    // TODO title should be inferred from the uid, not kept in state
    selectedMapVariables: {
      horizontal: {
        uid: null,
        title: null
      },
      vertical: {
        uid: null,
        title: null
      }
    },
    selectedContextualLayers: ['soy_infrastructure', 'land_conflicts']
  }
};

export const URL_STATE_PROPS = [
  'selectedCountry',
  'selectedCommodity',
  'selectedYears',
  'selectedQuant',
  'detailedView',
  'selectedRecolorBy',
  'selectedBiomeFilter',
  'selectedNodesIds',
  'expandedNodesIds',
  'areNodesExpanded',
  'selectedColumnsIds'
];

// index
export const HOMEPAGE_COMMODITY_WHITELIST = ['SOY'];
export const HOMEPAGE_COUNTRY_WHITELIST = ['BRAZIL'];


// fact sheets
export const FACT_SHEET_NODE_TYPE_WHITELIST = ['MUNICIPALITY', 'STATE', 'BIOME', 'EXPORTER', 'IMPORTER'];
export const STACK_AREA_COLORS = ['#ef6a68', '#ffae4f', '#76c370', '#69a4d0', '#9d7dbf'];
export const CHORD_COLORS = ['#ea6869', '#34444c'];

// map
export const CARTO_BASE_URL = 'https://p2cs-sei.carto.com/api/v1/map/';
export const CARTO_NAMED_MAPS_BASE_URL = 'https://p2cs-sei.carto.com/api/v1/map/named/';

// GA
export const GA_ACTION_WHITELIST = [
  {
    type: actions.UPDATE_NODE_SELECTION,
    getPayload: action => action.data.map(d => d.name).join(',')
  },
  {
    type: actions.SELECT_BIOME_FILTER,
    getPayload: action => action.biomeFilter
  },
  {
    type: actions.SELECT_YEARS,
    getPayload: action => action.years.join(',')
  },
  {
    type: actions.SELECT_RECOLOR_BY,
    getPayload: action => action.value
  },
  {
    type: actions.SELECT_QUANT,
    getPayload: action => action.quant
  },
  {
    type: actions.SELECT_VIEW,
    getPayload: action => (action.detailedView) ? 'detailed' : 'overview'
  },
  {
    type: actions.SELECT_COLUMN,
    getPayload: (action, state) => {
      return state.columns[action.columnId].name;
    }
  },
  {
    type: actions.TOGGLE_MAP
  },
  {
    type: actions.TOGGLE_MAP_LAYERS_MENU
  },
  {
    type: actions.SELECT_VECTOR_LAYERS,
    getPayload: action => [action.layerData.title, action.layerData.direction].join(' - ')
  },
  {
    type: actions.SELECT_CONTEXTUAL_LAYERS,
    getPayload: action => action.contextualLayers.join(', ')
  }

];
