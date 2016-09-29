
import connect from 'connect';
import MapLegend from 'components/map-legend.component';

const mapMethodsToState = (state) => ({
  selectedVectorLayers: state.flows.selectedVectorLayers
});

const mapViewCallbacksToActions = () => ({});

export default connect(MapLegend, mapMethodsToState, mapViewCallbacksToActions);
