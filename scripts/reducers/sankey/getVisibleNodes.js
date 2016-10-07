export default function(links, nodesDict, nodesMeta, columnIndexes) {
  const nodeIdsList = [];
  const nodes = [];

  const nodesDictWithMeta = _setNodesMeta(nodesDict, nodesMeta);

  links.forEach(link => {
    const pathNodeIds = link.attributes.path;
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

const _setNodesMeta = (nodesDict, nodesMeta) => {

  const nodesDictWithMeta = {};

  nodesMeta.forEach(nodeMeta => {
    const nodeId = nodeMeta.id;
    const node = Object.assign({}, nodesDict[nodeId]);
    if (nodeMeta.attributes && nodeMeta.attributes.height) {
      node.quant = {
        // TBD need to get node meta and quant meta https://github.com/sei-international/TRASE/issues/65
        value: nodeMeta.attributes.height,
        unit: '[unit]',
        name: '[quant]'
      }
      node.height = nodeMeta.attributes.height;
      nodesDictWithMeta[nodeId] = node;
    }
  });

  return nodesDictWithMeta;
};
