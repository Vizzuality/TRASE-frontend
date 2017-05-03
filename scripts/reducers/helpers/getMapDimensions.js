import getNodeMetaUid from './getNodeMetaUid';
import { MAP_DIMENSIONS_COLOR_SCALES } from 'constants';

export default function(mapDimensions) {
  mapDimensions.forEach(dimension => {
    dimension.uid = getNodeMetaUid(dimension.type, dimension.layerAttributeId);
  });

  // hydrate mapDimensions from API with hardcoded color scales
  // TODO ideally this should be set on the API side
  Object.keys(MAP_DIMENSIONS_COLOR_SCALES).forEach(mapDimensionName => {
    const mapDimension = mapDimensions.find(mapDimension => mapDimension.name === mapDimensionName);
    if (mapDimension !== undefined) {
      mapDimension.colorScale = MAP_DIMENSIONS_COLOR_SCALES[mapDimensionName];
    }
  });

  return mapDimensions;
}
