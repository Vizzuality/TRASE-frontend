import getNodeMetaUid from './getNodeMetaUid';

export default function(mapLayers) {
  mapLayers.forEach(layer => {
    layer.uid = getNodeMetaUid(layer.type, layer.id);
  });

  return mapLayers;
}
