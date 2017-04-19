import connect from 'connect';
import { selectMapDimension } from 'actions/tool.actions';
import { toggleModal, loadTooltip } from 'actions/app.actions';
import MapDimensions from 'components/tool/map-dimensions.component.js';

const mapMethodsToState = (state) => ({
  loadMapDimensions: {
    _comparedValue: (state) => state.tool.mapDimensions,
    _returnedValue: (state) => {
      return state.tool.mapDimensionsFolders.map(dimensionGroup => {
        return {
          dimensionGroup,
          dimensions: state.tool.mapDimensions.filter(dimension => dimension.groupId === dimensionGroup.id)
        };
      });
    }
  },
  selectMapDimensions: state.tool.selectedMapDimensions,
});

const mapViewCallbacksToActions = () => ({
  onMapDimensionsSelected: dimensionData => selectMapDimension(dimensionData),
  onToggleModal: (visibility, data) => toggleModal(visibility, data),
  onMapDimensionsLoaded: () => loadTooltip(),
});

export default connect(MapDimensions, mapMethodsToState, mapViewCallbacksToActions);
