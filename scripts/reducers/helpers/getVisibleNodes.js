export default function(links, nodesDict, nodesMeta, columnIndexes) {
  const nodeIdsList = [];
  const nodes = [];

  const nodesDictWithMeta = _setNodesMeta(nodesDict, nodesMeta);

  links.forEach(link => {
    const pathNodeIds = link.path;
    pathNodeIds.forEach(nodeId => {
      if (nodeIdsList.indexOf(nodeId) === -1) {
        nodeIdsList.push(nodeId);
        const node = nodesDictWithMeta[nodeId];
        if (!node) {
          console.warn('a nodeId in a link is missing from nodes dict', nodeId, link);
        } else if (columnIndexes.indexOf(node.columnId) === -1) {
          console.warn('link contains a node not in requested columns', node);
        } else {
          const node = Object.assign({}, nodesDictWithMeta[nodeId]);
          node.id = nodeId;
          nodes.push(node);
        }
      }
    });
  });

  return nodes;
}

// TODO get data from get_nodes instead of flow meta (except for heights)
// see setNodesMeta.js
const _setNodesMeta = (nodesDict, nodesMeta) => {
  const nodesDictWithMeta = {};

  nodesMeta.nodeHeights.forEach(nodeHeight => {
    const nodeId = nodeHeight.id;
    const node = Object.assign({}, nodesDict[nodeId]);
    node.height = nodeHeight.height;
    node.quant = nodeHeight.quant;
    node.quantName = nodesMeta.quant.name;
    node.quantUnit = nodesMeta.quant.unit;

    if (node.quantName === 'Deforestation risk') {
      node.quant = Math.round(node.quant);
    }

    node.quantNice = node.quant.toFixed(1);

    nodesDictWithMeta[nodeId] = node;
  });

  return nodesDictWithMeta;
};
