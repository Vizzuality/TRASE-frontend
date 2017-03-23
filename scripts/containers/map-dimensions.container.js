import connect from 'connect';
import { selectMapDimension } from 'actions/flows.actions';
import { toggleModal, loadTooltip } from 'actions/app.actions';
import MapDimensions from 'components/map-dimensions.component.js';

const mapMethodsToState = (state) => ({
  loadMapDimensions: {
    _comparedValue: (state) => state.flows.mapDimensions,
    _returnedValue: (state) => {
      return state.flows.mapDimensionsFolders.map(dimensionGroup => {
        return {
          dimensionGroup,
          dimensions: state.flows.mapDimensions.filter(dimension => dimension.groupId === dimensionGroup.id)
        };
      });
    }
  },
  selectMapDimensions: state.flows.selectedMapDimensions,
});

const mapViewCallbacksToActions = () => ({
  onMapDimensionsSelected: dimensionData => selectMapDimension(dimensionData),
  onToggleModal: (visibility, data) => toggleModal(visibility, data),
  onMapDimensionsLoaded: () => loadTooltip(),
});

export default connect(MapDimensions, mapMethodsToState, mapViewCallbacksToActions);
