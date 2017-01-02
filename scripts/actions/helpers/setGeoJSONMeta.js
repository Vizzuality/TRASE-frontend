import getNodeIdFromGeoId from 'actions/helpers/getNodeIdFromGeoId';

export default (geoJSON, nodesDict, columnId) => {
  geoJSON.features.forEach(feature => {
    const geoId = feature.properties.geoid;
    const nodeId = getNodeIdFromGeoId(geoId, nodesDict, columnId);
    const node = nodesDict[nodeId];
    if (node) {
      feature.properties.hasFlows = node.hasFlows;
    }
  });
  return geoJSON;
};
