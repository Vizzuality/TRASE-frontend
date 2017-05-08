import _ from 'lodash';
import { CHOROPLETH_CLASSES, CHOROPLETH_CLASS_ZERO } from 'constants';

export default function(selectedMapDimensions, nodesDictWithMeta) {
  const horizontalLayer = selectedMapDimensions[0];
  const verticalLayer = selectedMapDimensions[1];
  const isBidimensional = horizontalLayer !== null && verticalLayer !== null;
  const isEmpty = horizontalLayer === null && verticalLayer === null;
  const isHorizontal = horizontalLayer !== null;

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
        const nodeMetaHorizontal = node.meta[horizontalLayer];
        const nodeMetaVertical = node.meta[verticalLayer];

        if (!nodeMetaHorizontal || !nodeMetaVertical) {
          color = CHOROPLETH_CLASSES.error_no_metadata_layer;
        } else {
          const horizontalValue = nodeMetaHorizontal.value3;
          const verticalValue = nodeMetaVertical.value3;

          // use zero class only when both horizontal and vertical values are zero
          if (horizontalValue === 0 && verticalValue === 0) {
            color = CHOROPLETH_CLASS_ZERO;
          }
          // in case only one is zero, just ignore and use lowest bucket (Math.max zero)
          else {
            colors = CHOROPLETH_CLASSES.bidimensional;
            colorIndex = (2 - Math.max(0, verticalValue-1)) * 3 + Math.max(0, horizontalValue-1);
            color = colors[colorIndex];
          }
        }
      } else {
        const uid = (isHorizontal) ? horizontalLayer : verticalLayer;
        const nodeMeta = node.meta[uid];
        if (!nodeMeta) {
          color = CHOROPLETH_CLASSES.error_no_metadata_layer;  // no metadata on this node has been found for this layer
        } else {
          const value = nodeMeta.value5;
          if (value === 0) {
            color = CHOROPLETH_CLASS_ZERO;
          } else {
            colors = (isHorizontal) ? CHOROPLETH_CLASSES.horizontal : CHOROPLETH_CLASSES.vertical;
            colorIndex = Math.max(0, value-1);
            color = colors[colorIndex];
          }
        }
      }
    }

    choropleth[node.geoId] = color;
  });

  return choropleth;
}
