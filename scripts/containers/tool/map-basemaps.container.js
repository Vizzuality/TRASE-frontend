import connect from 'connect';
import { selectMapBasemap } from 'actions/tool.actions';
import { BASEMAPS } from 'constants';
import mapBasemaps from 'components/tool/map-basemaps.component';

const mapMethodsToState = (state) => ({
  buildBasemaps: BASEMAPS,
  selectBasemap: state.tool.selectedMapBasemap,
});

const mapViewCallbacksToActions = () => ({
  onMapBasemapSelected: basemapId => selectMapBasemap(basemapId)
});

export default connect(mapBasemaps, mapMethodsToState, mapViewCallbacksToActions);
