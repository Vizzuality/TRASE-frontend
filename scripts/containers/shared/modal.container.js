import connect from 'connect';
import Modal from 'components/shared/modal.component.js';

const mapMethodsToState = (state) => ({
  getModal: state.app.modal
});

const mapViewCallbacksToActions = () => ({});

export default connect(Modal, mapMethodsToState, mapViewCallbacksToActions);
