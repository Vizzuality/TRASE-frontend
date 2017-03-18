export const GET_CONTEXTS = 'GET_CONTEXTS';
export const GET_ALL_NODES = 'GET_ALL_NODES';
export const GET_COLUMNS = 'GET_COLUMNS';
export const GET_NODES = 'GET_NODES';
export const GET_FLOWS = 'GET_FLOWS';
export const GET_MAP_BASE_DATA = 'GET_MAP_BASE_DATA';
export const GET_LINKED_GEO_IDS = 'GET_LINKED_GEO_IDS';
export const GET_PLACE_FACTSHEET = 'GET_PLACE_FACTSHEET';
export const GET_ACTOR_FACTSHEET = 'GET_ACTOR_FACTSHEET';
export const GET_INDICATORS = 'GET_INDICATORS';
export const GET_JSON_DATA_DOWNLOAD_FILE = 'GET_JSON_DATA_DOWNLOAD_FILE';
export const GET_CSV_DATA_DOWNLOAD_FILE = 'GET_CSV_DATA_DOWNLOAD_FILE';

const API_ENDPOINTS = {
  [GET_CONTEXTS]: { version: 2, endpoint: '/get_contexts' },
  [GET_ALL_NODES]: { version: 2, endpoint: '/get_all_nodes' },
  [GET_COLUMNS]: { version: 2, endpoint: '/get_columns' },
  [GET_NODES]: { version: 1, endpoint: '/get_nodes' },
  [GET_FLOWS]: { version: 1, endpoint: '/get_flows' },
  [GET_MAP_BASE_DATA]: { version: 2, endpoint: '/get_map_base_data' },
  [GET_LINKED_GEO_IDS]: { version: 2, endpoint: '/get_linked_geoids' },
  [GET_PLACE_FACTSHEET]: { version: 1, endpoint: '/get_place_node_attributes' },
  [GET_ACTOR_FACTSHEET]: { version: 1, endpoint: '/get_actor_node_attributes' },
  [GET_INDICATORS]: { version: 2, endpoint: '/indicators' },
  [GET_CSV_DATA_DOWNLOAD_FILE]: { version: 2, endpoint: '/download.csv' },
  [GET_JSON_DATA_DOWNLOAD_FILE]: { version: 2, endpoint: '/download.json' },
};

function getURLForV2(endpoint, params = {}) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}[]=${arrCurrent}`;
      }, '');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_V2_URL}${endpoint}?`);
}

// builds an URL usable to call the API, using params
function getURLForV1(endpoint, params = {}) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}=${arrCurrent}`;
      }, '');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_V1_URL}${endpoint}?`);
}

export function getURLFromParams(endpointKey, params = {}) {
  const endpointData = API_ENDPOINTS[endpointKey];

  switch (endpointData.version) {

    case 2:
      return getURLForV2(endpointData.endpoint, params);
    default:
      return getURLForV1(`/v1${endpointData.endpoint}`, params);
  }
}
