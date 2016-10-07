export default function(selectedNodesIds, visibleNodes) {
  return visibleNodes.filter(node => selectedNodesIds.indexOf(node.id) > -1);
}
