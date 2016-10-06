export default function (rawNodes) {

  // store in node dict for use in getVisibleNodes
  const nodesDict = {};
  rawNodes.forEach(node => {
    const newNode = {
      columnId: parseInt(node.columnId),
      name: node.name
    };
    if (node.isAggregated) newNode.isAggregated = true;
    nodesDict[parseInt(node.id)] = newNode;
  });

  return nodesDict;
}
