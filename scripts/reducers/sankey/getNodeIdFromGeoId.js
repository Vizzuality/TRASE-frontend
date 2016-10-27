import _ from 'lodash';

export default (geoId, visibleNodes) => {
  if (geoId === undefined || geoId === null) {
    return null;
  }
  const node = _.find(visibleNodes, { geoId: geoId });
  if (node) {
    return node.id;
  }
  return null;
};
