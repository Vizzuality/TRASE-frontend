export default function (rawNodes, columns, nodesMeta) {

  const allInds = [];
  nodesMeta.inds.forEach(ind => {
    allInds[parseInt(ind.id)] = ind;
  });

  // store in node dict for use in getVisibleNodes
  const nodesDict = {};
  rawNodes.forEach(node => {
    const columnId = node.columnId;
    const column = columns.find(column => column.id === columnId);
    const newNode = {
      columnId: parseInt(node.columnId),
      columnName: column.name,
      columnPosition: column.position,
      name: node.name,
      geoId: node.geoId,
      inds: []
    };
    if (node.isAggregated === true || node.isAggregated === 'true') {
      newNode.isAggregated = true;
    }

    const nodeInds = node.inds;
    if (nodeInds) {
      nodeInds.forEach(nodeInd => {
        const indMeta = allInds[parseInt(nodeInd.id)];
        newNode.inds.push({
          name: indMeta.name,
          unit: indMeta.unit,
          values: nodeInd.values
        });
      });
    }

    nodesDict[parseInt(node.id)] = newNode;
  });

  return nodesDict;
}
