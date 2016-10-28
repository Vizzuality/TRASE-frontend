import _ from 'lodash';
import getNodeMetaUid from './getNodeMetaUid';

export default function(nodesDict, nodesMeta /*, layers*/) {
  const nodesDictWithMeta = {};
  const nodeIds = Object.keys(nodesDict);

  nodeIds.forEach(nodeId => {
    const node = nodesDict[nodeId];
    const nodeWithMeta = _.cloneDeep(node);

    const nodeMeta = nodesMeta[nodeId];
    nodeWithMeta.meta = null;

    if (nodeMeta) {
      nodeMeta.values.forEach(layerValue => {
        if (!nodeWithMeta.meta) nodeWithMeta.meta = {};
        const uid = getNodeMetaUid(layerValue.type, layerValue.id);
        nodeWithMeta.meta[uid] = {
          rawValue: layerValue.rawValue,
          value3: layerValue.rawValue3,
          value5: layerValue.rawValue5
          // also add layer name and unit
        };
      });
    }

    nodesDictWithMeta[nodeId] = nodeWithMeta;
  });

  return nodesDictWithMeta;
}
