import connect from 'connect';
import MapDimensions from 'components/tool/map-dimensions.component.js';

const mapMethodsToState = (state) => ({
  loadMapDimensions: state.tool.mapDimensionsGroups,
  selectMapDimensions: state.tool.selectedMapDimensions,
});

// const mapViewCallbacksToActions = () => ({
//   onMapDimensionsSelected: dimensionData => selectMapDimension(dimensionData),
//   onToggleModal: (visibility, data) => toggleModal(visibility, data),
//   onMapDimensionsLoaded: () => loadTooltip(),
// });

export default connect(MapDimensions, mapMethodsToState);
