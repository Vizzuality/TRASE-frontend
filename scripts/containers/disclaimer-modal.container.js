import connect from 'connect';
import ModalComponent from '../components/shared/modal.component.js';

const mapMethodsToState = (state) => ({
  getModal: state.app.modal
});

const mapViewCallbacksToActions = () => ({
  onClose: () => {},
});

export default connect(ModalComponent, mapMethodsToState, mapViewCallbacksToActions);
