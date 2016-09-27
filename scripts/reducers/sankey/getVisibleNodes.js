import { nest as d3_nest } from 'd3-collection';

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
          nodes.push({
            id: nodeId,
            name: nodesDictWithMeta[nodeId].name,
            columnId: nodesDictWithMeta[nodeId].columnId,
            height: nodesDictWithMeta[nodeId].height
          });
        }
      }
    });
  });


  const columns = d3_nest()
  .key(el => {
    return el.columnId;
  })
  .sortKeys((a, b) => {
    return (parseInt(a) < parseInt(b)) ? -1 : 1;
  })
  .entries(nodes);

  columns.forEach(column => {
    column.columnId = parseInt(column.key);
  });

  return columns;
}

const _setNodesMeta = (nodesDict, nodesMeta) => {

  const nodesDictWithMeta = {};

  nodesMeta.forEach(nodeMeta => {
    const nodeId = nodeMeta.id;
    const node = Object.assign({}, nodesDict[nodeId]);
    node.height = nodeMeta.attributes.height;
    nodesDictWithMeta[nodeId] = node;
  });

  return nodesDictWithMeta;
};
