export const GET_ALL_NODES = 'GET_ALL_NODES';
export const GET_COLUMNS = 'GET_COLUMNS';
export const GET_NODES = 'GET_NODES';
export const GET_FLOWS = 'GET_FLOWS';

const API_ENDPOINTS = {
  [GET_ALL_NODES]: { version: 2, endpoint: '/get_all_nodes' },
  [GET_COLUMNS]: { version: 2, endpoint: '/get_columns' },
  [GET_NODES]: { version: 1, endpoint: '/get_nodes' },
  [GET_FLOWS]: { version: 1, endpoint: '/get_flows' }
};

function getURLForV2(endpoint, params) {
  return Object.keys(params).reduce((prev, current) => {
    const value = params[current];
    if (Array.isArray(value)) {
      const arrUrl = value.reduce((arrPrev, arrCurrent) => {
        return `${arrPrev}&${current}=${arrCurrent}`;
      }, '');
      return `${prev}&${arrUrl}`;
    }
    return `${prev}&${current}=${params[current]}`;
  }, `${API_V2_URL}${endpoint}?`);
}

// builds an URL usable to call the API, using params
function getURLForV1(endpoint, params) {
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

export function getURLFromParams(endpointKey, params) {
  const endpointData = API_ENDPOINTS[endpointKey];

  switch (endpointData.version) {
    case 2:
      return getURLForV2(endpointData.endpoint, params)
    default:
      return getURLForV1(`/v1${endpointData.endpoint}`, params);
  }
}