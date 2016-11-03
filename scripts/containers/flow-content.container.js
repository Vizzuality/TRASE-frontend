import connect from 'connect';
import { toggleModal } from 'actions/app.actions';
import flowContent from 'components/flow-content.component';

const mapMethodsToState = (state) => ({
  toggleMapVisibility: state.app.isMapVisible,
  toggleMapLayersVisibility: state.app.isMapLayerVisible
});

const mapViewCallbacksToActions = () => ({
  onToggleModal: (visibility, data) => toggleModal(visibility, data)
});
export default connect(flowContent, mapMethodsToState, mapViewCallbacksToActions);
