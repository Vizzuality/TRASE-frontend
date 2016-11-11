// See https://github.com/sei-international/TRASE/issues/112
export default (nodeId, columnId) => {
  if ([0,1,2,3,4,6].indexOf(columnId) > -1) {
    // TODO rename factsheets to factsheet-actor
    const baseURL = ([0,1,2,3].indexOf(columnId) > -1) ? 'factsheet-place' : 'factsheet-actor';
    return `./${baseURL}.html?nodeId=${nodeId}`;
  }

  return null;
};
