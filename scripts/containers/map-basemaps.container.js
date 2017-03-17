import connect from 'connect';
import { selectMapBasemap } from 'actions/flows.actions';
import { BASEMAPS } from 'constants';
import mapBasemaps from 'components/map-basemaps.component';

const mapMethodsToState = (state) => ({
  buildBasemaps: BASEMAPS, selectBasemap: state.flows.selectedMapBasemap,
});

const mapViewCallbacksToActions = () => ({
  onMapBasemapSelected: basemapId => selectMapBasemap(basemapId)
});

export default connect(mapBasemaps, mapMethodsToState, mapViewCallbacksToActions);
