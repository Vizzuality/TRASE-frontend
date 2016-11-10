// break down links into simple src - target binomes
export default function(rawLinks, nodesDict) {
  const links = [];
  rawLinks.forEach(link => {
    var path = link.path;
    for (var i = 0; i < path.length-1; i++) {
      const sourceNodeId = path[i];
      const targetNodeId = path[i + 1];
      links.push({
        sourceNodeId,
        targetNodeId,
        sourceColumnId: nodesDict[sourceNodeId].columnId,
        targetColumnId: nodesDict[targetNodeId].columnId,
        height: link.height,
        quant: parseFloat(link.quant),
        qual: (link.qual === undefined || link.qual === null) ? 'none' : link.qual.replace(/\s/gi, '').toLowerCase(),
        ind: (link.ind === undefined || link.ind === null) ? 'none' : link.ind,
        originalPath: path
      });
    }
  });
  return links;
}
