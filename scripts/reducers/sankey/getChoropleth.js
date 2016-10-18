import _ from 'lodash';

export default function(selectedVectorLayers, nodesDictWithMeta, allColors) {
  const horizontalLayer = selectedVectorLayers.horizontal;
  const verticalLayer = selectedVectorLayers.vertical;
  const isBidimensional = horizontalLayer.uid && verticalLayer.uid ? true : false;
  const isEmpty = !horizontalLayer.uid && !verticalLayer.uid;
  const isHorizontal = !!horizontalLayer.uid;

  const geoNodes = _.filter(nodesDictWithMeta, node => node.geoId !== undefined);
  const nodeIds = Object.keys(geoNodes);
  const choropleth = {};

  nodeIds.forEach(nodeId => {
    const node = geoNodes[nodeId];
    let color = 'none';

    if (isEmpty) {
      color = 'none';
    } else if (!node.meta) {
      color = '#0f0';
    } else {
      let colors;
      let colorIndex;

      if (isBidimensional) {
        const horizontalLayerValue = node.meta[horizontalLayer.uid];
        const verticalLayerValue = node.meta[verticalLayer.uid];

        if (!horizontalLayerValue || !verticalLayerValue) {
          color = '#f0f';
        } else {
          const horizontalValue = horizontalLayerValue.value3;
          const verticalValue = verticalLayerValue.value3;
          colors = allColors.bidimensional;
          colorIndex = (2 - verticalValue) * 3 + horizontalValue;
          color = colors[colorIndex];
        }
      } else {
        const uid = (isHorizontal) ? horizontalLayer.uid : verticalLayer.uid;
        const value = node.meta[uid];
        if (!value) {
          color = '#f0f';
        } else {
          colors = (isHorizontal) ? allColors.horizontal : allColors.vertical;
          colorIndex = value.value5;
          color = colors[colorIndex];
        }
      }
    }

    choropleth[node.geoId] = color;
  });

  return choropleth;
}
