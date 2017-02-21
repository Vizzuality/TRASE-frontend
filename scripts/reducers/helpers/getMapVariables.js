import getNodeMetaUid from './getNodeMetaUid';

export default function(mapVariables) {
  mapVariables.forEach(layer => {
    layer.uid = getNodeMetaUid(layer.type, layer.id);
  });

  return mapVariables;
}
