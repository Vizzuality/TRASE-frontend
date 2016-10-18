export default function(mapLayers) {
  mapLayers.forEach(layer => {
    layer.uid = `${layer.type}${layer.id}`;
  });

  return mapLayers;
}
