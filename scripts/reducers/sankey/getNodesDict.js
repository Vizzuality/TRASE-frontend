import getFactSheetLink from 'utils/getFactSheetLink';

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

    newNode.link = getFactSheetLink(newNode.id, newNode.columnId);

    nodesDict[parseInt(node.id)] = newNode;
  });

  return nodesDict;
}
