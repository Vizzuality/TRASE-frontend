import getNodeMetaUid from './getNodeMetaUid';

export default function(mapLayers) {
  mapLayers.forEach(layer => {
    layer.uid = getNodeMetaUid(layer.type, layer.attributeId);
  });

  return mapLayers;
}
