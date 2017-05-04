import connect from 'connect';
import MapDimensions from 'components/tool/map-dimensions.component.js';
import { toggleMapSidebarGroup } from 'actions/tool.actions';

const mapMethodsToState = (state) => ({
  loadMapDimensions: {
    _comparedValue: (state) => state.tool.mapDimensionsGroups,
    _returnedValue: (state) => {
      return {
        mapDimensionsGroups: state.tool.mapDimensionsGroups,
        expandedMapSidebarGroupsIds: state.tool.expandedMapSidebarGroupsIds
      };
    }
  },
  selectMapDimensions: state.tool.selectedMapDimensions,
  toggleSidebarGroups: state.tool.expandedMapSidebarGroupsIds
});

const mapViewCallbacksToActions = () => ({
  // onMapDimensionsSelected: dimensionData => selectMapDimension(dimensionData),
  // onToggleModal: (visibility, data) => toggleModal(visibility, data),
  // onMapDimensionsLoaded: () => loadTooltip(),
  onToggleGroup: (id) => toggleMapSidebarGroup(id)
});

export default connect(MapDimensions, mapMethodsToState, mapViewCallbacksToActions);
