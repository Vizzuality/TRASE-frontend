import _ from 'lodash';

export default (geoId, visibleNodes) => {
  const node = _.find(visibleNodes, { geoId: geoId });
  if (node) {
    return node.id;
  }
  return null;
};
