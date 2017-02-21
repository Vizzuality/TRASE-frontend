import connect from 'connect';
import { selectMapVariables } from 'actions/flows.actions';
import { toggleModal } from 'actions/app.actions';
import MapVariables from 'components/map-variables.component';

const mapMethodsToState = (state) => ({
  loadMapVariables: state.flows.mapVariables,
  selectMapVariables: state.flows.selectedMapVariables,
});

const mapViewCallbacksToActions = () => ({
  onMapVariablesSelected: variableData => selectMapVariables(variableData),
  onToggleModal: (visibility, data) => toggleModal(visibility, data)
});

export default connect(MapVariables, mapMethodsToState, mapViewCallbacksToActions);
