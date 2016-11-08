import connect from 'connect';
import { resetState } from 'actions/flows.actions';
import Clear from 'components/clear.component';

const mapMethodsToState = () => ({
});

const mapViewCallbacksToActions = () => ({
  onClearClick: () => resetState()
});

export default connect(Clear, mapMethodsToState, mapViewCallbacksToActions);
