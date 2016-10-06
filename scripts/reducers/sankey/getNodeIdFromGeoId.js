import _ from 'lodash';

export default (geoId, nodesDict) => {
  const nodeId = _.findKey(nodesDict, { geoId: geoId });
  return parseInt(nodeId);
};
