export default (geoId, nodesDict, selectedColumnsIds) => {
  if (geoId === undefined || geoId === null) {
    return null;
  }

  // node should match geoId obv, but also columnId (needed because municip and logistics hubs have the same geoIds)
  const nodeId = Object.keys(nodesDict).find(nodeId => {
    return nodesDict[nodeId].geoId === geoId && selectedColumnsIds[0] === nodesDict[nodeId].columnId;
  });
  return parseInt(nodeId, 10);
};
