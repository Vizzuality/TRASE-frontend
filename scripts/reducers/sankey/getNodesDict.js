export default function (rawNodes, columns /*, nodesMeta*/) {

  // store in node dict for use in getVisibleNodes
  const nodesDict = {};
  rawNodes.forEach(node => {
    const columnId = node.columnId;
    const column = columns.find(column => column.id === columnId);

    const newNode = {
      id: node.id,
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

    // See https://github.com/sei-international/TRASE/issues/112
    if ([0,1,2,4,5].indexOf(newNode.columnId) > -1) {
      // TODO rename factsheets to factsheet-actor
      const baseURL = ([0,1,2].indexOf(newNode.columnId) > -1) ? 'factsheet-place' : 'factsheets';
      newNode.link = `./${baseURL}.html?nodeId=${newNode.id}`;
    }

    nodesDict[parseInt(node.id)] = newNode;
  });

  return nodesDict;
}
