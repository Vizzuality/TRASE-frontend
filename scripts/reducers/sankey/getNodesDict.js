export default function (rawNodes, columns) {
  console.log(columns)
  // store in node dict for use in getVisibleNodes
  const nodesDict = {};
  rawNodes.forEach(node => {
    const columnId = node.columnId;
    const column = columns.find(column => parseInt(column.id) === columnId);
    const newNode = {
      columnId: parseInt(node.columnId),
      name: node.name,
      geoId: node.geoId,
      columnName: column.attributes.nodeType
    };
    if (node.isAggregated) newNode.isAggregated = true;
    nodesDict[parseInt(node.id)] = newNode;
  });

  return nodesDict;
}
