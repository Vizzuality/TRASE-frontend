import _ from 'lodash';

export default (geoId, visibleNodes) => {
  const node = _.find(visibleNodes, { geoId: geoId });
  console.log(node)
  if (node) {
    return node.id;
  }
  return null;
};
