import connect from 'connect';
import { selectMapVariable } from 'actions/flows.actions';
import { toggleModal } from 'actions/app.actions';
import MapVariables from 'components/map-variables.component';

const mapMethodsToState = (state) => ({
  loadMapVariables: {
    _comparedValue: (state) => state.flows.mapVariables,
    _returnedValue: (state) => {
      return state.flows.mapVariablesFolders.map(folder => {
        return {
          folder,
          variables: state.flows.mapVariables.filter(variable => variable.folder_id === folder.id)
        };
      });
    }
  },
  selectMapVariables: state.flows.selectedMapVariables,
});

const mapViewCallbacksToActions = () => ({
  onMapVariablesSelected: variableData => selectMapVariable(variableData),
  onToggleModal: (visibility, data) => toggleModal(visibility, data)
});

export default connect(MapVariables, mapMethodsToState, mapViewCallbacksToActions);
