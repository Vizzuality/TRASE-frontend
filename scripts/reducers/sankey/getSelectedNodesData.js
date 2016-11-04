export default function(selectedNodesIds, visibleNodes) {
  if (selectedNodesIds === undefined) {
    return [];
  }
  return selectedNodesIds.map(nodeId => visibleNodes.find(node => node.id === nodeId));
}
