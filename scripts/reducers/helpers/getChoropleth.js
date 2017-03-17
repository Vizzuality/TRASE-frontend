import _ from 'lodash';
import { CHOROPLETH_CLASSES } from 'constants';

export default function (selectedMapDimensions, nodesDictWithMeta) {
  const horizontalLayer = selectedMapDimensions.horizontal;
  const verticalLayer = selectedMapDimensions.vertical;
  const isBidimensional = horizontalLayer.uid !== null && verticalLayer.uid !== null;
  const isEmpty = horizontalLayer.uid === null && verticalLayer.uid === null;
  const isHorizontal = horizontalLayer.uid !== null;

  const geoNodes = _.filter(nodesDictWithMeta, node => node.geoId !== undefined && node.geoId !== null);
  const geoNodesIds = Object.keys(geoNodes);
  const choropleth = {};

  geoNodesIds.forEach(nodeId => {
    const node = geoNodes[nodeId];
    let color = 'none';

    if (isEmpty) {
      color = 'none';
    } else if (!node.meta) {
      color = CHOROPLETH_CLASSES.error_no_metadata; // no metadata on this node has been found (something missing in get_nodes)
    } else {
      let colors;
      let colorIndex;

      if (isBidimensional) {
        const horizontalLayerValue = node.meta[horizontalLayer.uid];
        const verticalLayerValue = node.meta[verticalLayer.uid];

        if (!horizontalLayerValue || !verticalLayerValue) {
          color = CHOROPLETH_CLASSES.error_no_metadata_layer;
        } else {
          const horizontalValue = horizontalLayerValue.value3;
          const verticalValue = verticalLayerValue.value3;
          colors = CHOROPLETH_CLASSES.bidimensional;
          colorIndex = (2 - Math.max(0, verticalValue - 1)) * 3 + Math.max(0, horizontalValue - 1);
          color = colors[colorIndex];
        }
      } else {
        const uid = (isHorizontal) ? horizontalLayer.uid : verticalLayer.uid;
        const value = node.meta[uid];
        if (!value) {
          color = CHOROPLETH_CLASSES.error_no_metadata_layer;  // no metadata on this node has been found for this layer
        } else {
          colors = (isHorizontal) ? CHOROPLETH_CLASSES.horizontal : CHOROPLETH_CLASSES.vertical;
          colorIndex = value.value5;
          color = colors[Math.max(0, colorIndex - 1)];
        }
      }
    }

    choropleth[node.geoId] = color;
  });

  return choropleth;
}
