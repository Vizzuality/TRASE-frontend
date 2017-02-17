export default (geoJSON, nodesDict, geoIdsDict, columnId) => {
  geoJSON.features.forEach(feature => {
    const geoId = feature.properties.geoid;
    const nodeId = geoIdsDict[`${columnId}-${geoId}`];
    const node = nodesDict[nodeId];
    if (node) {
      feature.properties.hasFlows = node.hasFlows;
    }
  });
  return geoJSON;
};
