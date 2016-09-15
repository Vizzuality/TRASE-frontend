// break down links into simple src - target binomes
export default function(rawLinks, nodesDict) {
  const links = [];
  rawLinks.forEach(link => {
    var path = link.attributes.path;
    for (var i = 0; i < path.length-1; i++) {
      const sourceNodeId = path[i];
      const targetNodeId = path[i + 1];
      links.push({
        sourceNodeId,
        targetNodeId,
        sourceColumnId: nodesDict[sourceNodeId].columnId,
        targetColumnId: nodesDict[targetNodeId].columnId,
        height: link.attributes.height,
        quant: parseFloat(link.attributes.flowQuants[0].value),
        originalPath: path
      });
    }
  });
  return links;
}
