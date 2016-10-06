import _ from 'lodash';

export default (geoId, nodesDict) => {
  const node = _.findKey(nodesDict, { geoId: geoId });
  return node;
};
