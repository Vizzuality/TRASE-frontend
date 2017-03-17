import getFactSheetLink from 'utils/getFactSheetLink';

export default function (rawNodes, columns /*, nodesMeta*/) {
  // store in node dict for use in getVisibleNodes

  const nodesDict = {};
  const geoIdsDict = {};
  rawNodes.forEach(node => {
    const columnId = node.columnId;
    const column = columns.find(column => column.id === columnId);
    const newNode = {
      id: node.id,
      columnId: parseInt(node.columnId),
      columnName: column.name,
      columnGroup: column.group,
      isDefault: column.isDefault,
      columnPosition: column.position,
      name: node.name,
      geoId: node.geoId
      // inds: []
    };

    // TODO temp hack, wait for DB fix
    if (node.name === 'None' || node.name === 'DOMESTIC CONSUMPTION' || node.id === 424) {
      newNode.isDomestic = true;
      newNode.name = 'DOMESTIC CONSUMPTION';
    }

    if (node.isDomestic === true || node.isDomestic === 'true') {
      newNode.isDomestic = true;
    }

    if (node.isAggregated === true || node.isAggregated === 'true') {
      newNode.isAggregated = true;
    }

    if (node.isUnknown === true || node.isUnknown === 'true') {
      newNode.isUnknown = true;
    }

    if (node.hasFlows === true || node.hasFlows === 'true') {
      newNode.hasFlows = true;
    }

    newNode.link = getFactSheetLink(newNode.id, newNode.columnId);

    nodesDict[parseInt(node.id)] = newNode;
    if (node.geoId) {
      geoIdsDict[`${columnId}-${node.geoId}`] = node.id;
    }
  });
  return { nodesDict, geoIdsDict };
}
