import connect from 'connect';
//import { selectNodeFromGeoId, highlightNodeFromGeoId } from 'actions/flows.actions';
import dataContent from 'components/data-content.component';

const mapMethodsToState = (state) => ({
  fillSelectors: state.flows.contexts,
});

const mapViewCallbacksToActions = () => ({
});

export default connect(dataContent, mapMethodsToState, mapViewCallbacksToActions);
