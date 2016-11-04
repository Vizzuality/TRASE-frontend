// flows
export const NUM_COLUMNS = 4;
export const COLUMNS_POS = [[0, 1, 2], [3, 4], [5], [6]];
export const NUM_NODES_SUMMARY = 10;
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
  error_no_metadata: '#0f0',
  error_no_metadata_for_layer: '#f0f',
};


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
    selectedYears: [2015, 2016],
    selectedQuant: 'Volume',
    detailedView: false,
    selectedView: 1,
    selectedQual: 'none',
    selectedNodesIds: [],
    areNodesExpanded: false,
    selectedNodesData: [],
    selectedColumnsIds: [2, 4, 6, 7],
    selectedVectorLayers: {
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


// fact sheets
export const STACK_AREA_COLORS = ['#ef6a68', '#ffae4f', '#76c370', '#69a4d0', '#9d7dbf'];
export const CARTO_BASE_URL = 'https://p2cs-sei.cartodb.com/api/v1/map/';
