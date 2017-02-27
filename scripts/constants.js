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

export const CHOROPLETH_CLASSES = {
  bidimensional: [
    'ch-bi-0-2', 'ch-bi-1-2', 'ch-bi-2-2',
    'ch-bi-0-1', 'ch-bi-1-1', 'ch-bi-2-1',
    'ch-bi-0-0', 'ch-bi-1-0', 'ch-bi-2-0'
  ],
  horizontal: ['ch-red-0', 'ch-red-1', 'ch-red-2', 'ch-red-3', 'ch-red-4'],
  vertical: ['ch-blue-0', 'ch-blue-1', 'ch-blue-2', 'ch-blue-3', 'ch-blue-4'],
  error_no_metadata: 'ch-no-meta',
  error_no_metadata_for_layer: 'ch-no-meta-layer',
};

export const NODE_SELECTION_LINKS_NUM_COLORS = 10;
export const SANKEY_TRANSITION_TIME = 1000;

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
    // TODO title should be inferred from the uid, not kept in state
    selectedMapLayers: {
      horizontal: {
        uid: null,
        title: null
      },
      vertical: {
        uid: null,
        title: null
      }
    },
    selectedContextualLayers: ['soy_infrastructure', 'land_conflicts'],
    recolorGroups: []
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
export const MAP_PANES = {
  basemap: 'basemap',
  vectorMain: 'vectorMain',
  vectorLinked: 'vectorLinked',
  vectorOutline: 'vectorOutline',
  context: 'context',
  basemapLabels: 'basemapLabels'
};
export const MAP_PANES_Z = {
  [MAP_PANES.basemap]: 200,
  [MAP_PANES.vectorMain]: 410,
  [MAP_PANES.vectorLinked]: 411,
  [MAP_PANES.vectorOutline]: 412,
  [MAP_PANES.context]: 420,
  [MAP_PANES.basemapLabels]: 490
};
export const BASEMAPS = {
  positron: {
    title: 'Positron',
    url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    labelsUrl: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

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
    type: actions.SELECT_CONTEXTUAL_LAYERS,
    getPayload: action => action.contextualLayers.join(', ')
  }

];
