export default function(selectedNodesIds, visibleNodes) {
  return selectedNodesIds.map(nodeId => visibleNodes.find(node => node.id === nodeId));
}
