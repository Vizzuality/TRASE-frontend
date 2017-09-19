import { COLUMN_IDS_THAT_ARE_ACTUALLY_GEO } from 'constants';

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
      type: column.name,
      columnGroup: column.group,
      isDefault: column.isDefault,
      // TODO hacky hacky hack
      // isGeo is set on each node, because a node can have a geoId, but we don't want it to behave as such (import countries)
      isGeo: column.isGeo || COLUMN_IDS_THAT_ARE_ACTUALLY_GEO.indexOf(column.id) > -1,
      name: node.name,
      profileType: node.profileType,
      geoId: node.geoId
    };

    if (node.isDomesticConsumption === true || node.isDomesticConsumption === 'true') {
      newNode.isDomesticConsumption = true;
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

    nodesDict[parseInt(node.id)] = newNode;
    if (node.geoId) {
      geoIdsDict[`${columnId}-${node.geoId}`] = node.id;
    }
  });
  return { nodesDict, geoIdsDict };
}
