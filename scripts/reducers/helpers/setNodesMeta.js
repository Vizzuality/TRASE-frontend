import _ from 'lodash';
import niceNumber from 'utils/niceNumber';
import getNodeMetaUid from './getNodeMetaUid';

export default function(nodesDict, nodesMeta, layers) {
  const layersByUID =_.keyBy(layers, 'uid');
  const nodesDictWithMeta = {};
  const nodeIds = Object.keys(nodesDict).map(id => parseInt(id, 10));

  nodeIds.forEach(nodeId => {
    const node = nodesDict[nodeId];
    const nodeWithMeta = _.cloneDeep(node);

    const nodeMeta = nodesMeta.find(nodeMeta => nodeMeta.id === nodeId);
    nodeWithMeta.meta = {};

    if (nodeMeta) {
      nodeMeta.values.forEach(layerValue => {
        if (!nodeWithMeta.meta) nodeWithMeta.meta = {};
        const uid = getNodeMetaUid(layerValue.type, layerValue.id);
        nodeWithMeta.meta[uid] = {
          rawValue: layerValue.rawValue,
          rawValueNice: niceNumber(layerValue.rawValue),
          value3: layerValue.value3,
          value5: layerValue.value5,
          name: layersByUID[uid].name,
          unit: layersByUID[uid].unit,
        };
      });
    }

    nodesDictWithMeta[nodeId] = nodeWithMeta;
  });

  return nodesDictWithMeta;
}
