import actions from 'actions';

// flows
export const NUM_COLUMNS = 4;
export const NUM_NODES_SUMMARY = 10;
export const NUM_NODES_EXPANDED = 100;
export const NUM_NODES_DETAILED = 999;
export const DETAILED_VIEW_SCALE = 1200;
export const DETAILED_VIEW_MIN_NODE_HEIGHT = 14;
export const DETAILED_VIEW_MIN_LINK_HEIGHT = 1;

export const CHOROPLETH_CLASS_ZERO = 'ch-zero';
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

export const MAP_DIMENSIONS_COLOR_SCALES = {
  'Production of soy': 'blues',
  'Average soy yield': 'blues',
  '% soy of total farming land': 'blues',
  'Territorial deforestation': 'reds',
  'Maximum soy deforestation': 'reds',
  'Soy deforestation (currently only available for the Cerrado and only up until 2014)': 'reds',
  'Land based CO2 emissions': 'reds',
  'Water scarcity': 'blue-red',
  'Loss of amphibian habitat': 'reds',
  'Area affected by fires in 2013': 'reds',
  'Permanent Protected Area (PPA) deficit': 'reds',
  'Legal Reserve (LR) deficit': 'reds',
  'Forest Code deficit': 'reds',
  'Number of environmental embargos (2015)': 'reds',
  '% of soy under zero deforestation commitments': 'red-blue',
  'Human development index': 'red-blue',
  'GDP per capita': 'blues',
  '% GDP from agriculture': 'blues',
  'Smallholder dominance': 'greens',
  'Reported cases of forced labour (2014)': 'reds',
  'Land conflicts (2014)': 'reds'
};
export const PROFILE_CHOROPLETH_CLASSES = ['ch-red-0', 'ch-red-1', 'ch-red-2', 'ch-red-3', 'ch-red-4'];

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

export const TOOL_DEFAULT_STATE = {
  tool: {
    selectedNodesIds: [],
    expandedNodesIds: [],
    areNodesExpanded: false,
    detailedView: false,
    selectedNodesData: [],
    selectedMapDimensions: [null, null],
    selectedContextualLayers: ['soy_infrastructure', 'land_conflicts'],
    selectedMapBasemap: 'default',
    isMapVisible: false,
    expandedMapSidebarGroupsIds: []
  }
};

export const DATA_DEFAULT_STATE = {
  data: {}
};


// fact sheets
export const FACT_SHEET_NODE_TYPE_WHITELIST = ['MUNICIPALITY', 'STATE', 'BIOME', 'EXPORTER', 'IMPORTER'];
export const ACTORS_TOP_SOURCES_SWITCHERS_BLACKLIST = ['included_years', 'buckets'];
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
  default: {
    title: 'Default',
    url: '//api.mapbox.com/styles/v1/trasebase/cizi55y2r00122rl65a97ppz1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    labelsUrl: '//api.mapbox.com/styles/v1/traselabels/cizi59ohm00122spaghssyqsd/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJhc2VsYWJlbHMiLCJhIjoiY2l6aTU4bm9sMDAyczMzazdwNWJ1MmFmbSJ9.zcNOZLokWun7cDwbArtV6g',
    attribution: '<span>&copy;</span> <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <span>&copy;</span> <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    thumbnail: 'images/maps/thumb-basemap-default.png'
  },
  satellite: {
    title: 'Satellite',
    url: '//api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJhc2ViYXNlIiwiYSI6ImNpemk1NWdhOTAwMmYyeGw5dXRncHpvZGEifQ.fQ6F9DSqmhLXZs-nKiYvzA',
    attribution: '<a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a>, <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>, <a href="https://www.digitalglobe.com/" target="_blank">DigitalGlobe</a>',
    thumbnail: 'images/maps/thumb-basemap-satellite.jpeg'
  },
  topo: {
    title: 'Topography',
    url: '//{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy;<a href="http://opentopomap.org">opentopomap.org</a>',
    thumbnail: 'images/maps/thumb-basemap-topo.png'
  },
  streets: {
    title: 'Streets (OSM)',
    url: '//{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy;<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
    thumbnail: 'images/maps/thumb-basemap-streets.png'
  },
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
    type: actions.SELECT_RESIZE_BY,
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
