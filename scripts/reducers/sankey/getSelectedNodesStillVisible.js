export default function(visibleNodes, selectedNodeIds) {
  return visibleNodes.filter(node => selectedNodeIds.indexOf(node.id) > -1)
    .map(node => node.id);
}
