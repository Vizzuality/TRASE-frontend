import _ from 'lodash';
import { LEGEND_COLORS } from 'constants';

export default function(selectedMapVariables, nodesDictWithMeta, allColors) {
  const horizontalLayer = selectedMapVariables.horizontal;
  const verticalLayer = selectedMapVariables.vertical;
  const isBidimensional = horizontalLayer.uid !== null && verticalLayer.uid !== null;
  const isEmpty = horizontalLayer.uid === null && verticalLayer.uid === null;
  const isHorizontal = horizontalLayer.uid !== null;

  const geoNodes = _.filter(nodesDictWithMeta, node => node.geoId !== undefined);
  const nodeIds = Object.keys(geoNodes);
  const choropleth = {};

  nodeIds.forEach(nodeId => {
    const node = geoNodes[nodeId];
    let color = 'none';

    if (isEmpty) {
      color = 'none';
    } else if (!node.meta) {
      color = LEGEND_COLORS.error_no_metadata; // no metadata on this node has been found (something missing in get_nodes)
    } else {
      let colors;
      let colorIndex;

      if (isBidimensional) {
        const horizontalLayerValue = node.meta[horizontalLayer.uid];
        const verticalLayerValue = node.meta[verticalLayer.uid];

        if (!horizontalLayerValue || !verticalLayerValue) {
          color = LEGEND_COLORS.error_no_metadata_layer;
        } else {
          const horizontalValue = horizontalLayerValue.value3;
          const verticalValue = verticalLayerValue.value3;
          colors = allColors.bidimensional;
          colorIndex = (2 - Math.max(0, verticalValue-1)) * 3 + Math.max(0, horizontalValue-1);
          color = colors[colorIndex];
        }
      } else {
        const uid = (isHorizontal) ? horizontalLayer.uid : verticalLayer.uid;
        const value = node.meta[uid];
        if (!value) {
          color = LEGEND_COLORS.error_no_metadata_layer;  // no metadata on this node has been found for this layer
        } else {
          colors = (isHorizontal) ? allColors.horizontal : allColors.vertical;
          colorIndex = value.value5;
          color = colors[Math.max(0, colorIndex-1)];
        }
      }
    }

    choropleth[node.geoId] = color;
  });

  return choropleth;
}
