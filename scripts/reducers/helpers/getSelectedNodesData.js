import _ from 'lodash';

export default function(selectedNodesIds, visibleNodes, nodesDictWithMeta) {
  if (selectedNodesIds === undefined) {
    return [];
  }
  // console.log(selectedNodesIds)
  return selectedNodesIds.map(nodeId => {
    const visibleNode = visibleNodes.find(node => node.id === nodeId);
    if (nodesDictWithMeta === undefined) {
      return _.cloneDeep(visibleNode);
    } else {
      const node = _.cloneDeep(nodesDictWithMeta[nodeId]);
      return Object.assign(node, visibleNode);
    }
  });
}
