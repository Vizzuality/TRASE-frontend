import _ from 'lodash';
import getNodeMetaUid from './getNodeMetaUid';

export default function(nodesDict, nodesMeta, layers) {
  const layersByUID =_.keyBy(layers, 'uid');
  const nodesDictWithMeta = {};

  nodesMeta.forEach(nodeMeta => {
    const nodeId = parseInt(nodeMeta.id);
    const nodeWithMeta = _.cloneDeep(nodesDict[nodeId]);
    nodeMeta.values.forEach(layerValue => {
      if (!nodeWithMeta.meta) nodeWithMeta.meta = {};

      const uid = getNodeMetaUid(layerValue.type, layerValue.id);
      const layerByUID = layersByUID[uid];

      const dimensionMeta = {
        rawValue: layerValue.rawValue,
        rawValueNice: layerValue.rawValue.toFixed(1),
        value3: layerValue.value3,
        value5: layerValue.value5,
        name: layerByUID.name
      };

      if (layerByUID.unit !== undefined && layerByUID.unit !== 'Unitless') {
        dimensionMeta.unit = layerByUID.unit;
      }

      nodeWithMeta.meta[uid] = dimensionMeta;
    });
    nodesDictWithMeta[nodeId] = nodeWithMeta;
  });
  return nodesDictWithMeta;
}
