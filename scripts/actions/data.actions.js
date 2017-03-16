import actions from 'actions';
import {
  getURLFromParams,
  GET_CONTEXTS
} from 'utils/getURLFromParams';

export function loadContext() {
  return (dispatch) => {
    const contextURL = getURLFromParams(GET_CONTEXTS);

    fetch(contextURL).then(resp => resp.text()).then(data => {
      const payload = JSON.parse(data).data;

      dispatch({
        type: actions.LOAD_CONTEXTS, payload
      });
    });
  };
}
