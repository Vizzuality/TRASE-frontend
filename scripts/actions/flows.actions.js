import actions from 'actions';
import getURLFromParams from 'utils/getURLFromParams';

export function selectCountry(country, reloadLinks) {
  return _getSelectAction('country', country, actions.SELECT_COUNTRY, reloadLinks);
}
export function selectCommodity(commodity, reloadLinks) {
  return _getSelectAction('commodity', commodity, actions.SELECT_COMMODITY, reloadLinks);
}
export function selectYears(years, reloadLinks) {
  return _getSelectAction('years', years, actions.SELECT_YEARS, reloadLinks);
}
export function selectQuant(quant, reloadLinks) {
  return _getSelectAction('quant', quant, actions.SELECT_QUANT, reloadLinks);
}
export function selectQual(qual, reloadLinks) {
  return _getSelectAction('qual', qual, actions.SELECT_QUAL, reloadLinks);
}

const _getSelectAction = (param, value, type, reloadLinks = true) => {
  // console.log(param, value, type, reloadLinks)
  return dispatch => {
    const action = {
      type
    };
    action[param] = value;
    dispatch(action);
    if (reloadLinks) {
      dispatch(loadLinks());
    }
  };
};

export function loadInitialData() {
  return (dispatch, getState) => {
    const params = {
      country: getState().flows.selectedCountry,
      raw: getState().flows.selectedCommodity
    };
    const nodesURL = getURLFromParams('/v1/get_all_nodes', params);
    const columnsURL = getURLFromParams('/v1/get_columns', params);

    Promise.all([nodesURL, columnsURL].map(url =>
        fetch(url).then(resp => resp.text())
    )).then(payload => {
      dispatch({
        type: actions.GET_COLUMNS,
        payload,
      });
      dispatch(loadLinks());
    });
  };
}

export function loadLinks() {
  return (dispatch, getState) => {
    const columnIndexes = [0,3,4,8];
    const params = {
      country: getState().flows.selectedCountry.toUpperCase(),
      raw: getState().flows.selectedCommodity.toUpperCase(),
      year_start: getState().flows.selectedYears[0],
      include_columns: columnIndexes,
      n_nodes: 10,
      flow_quant: getState().flows.selectedQuant,
      flow_qual: getState().flows.selectedQual
    };
    const url = getURLFromParams('/v1/get_flows', params);

    fetch(url)
      .then(res => res.text())
      .then(payload => {
        dispatch({
          type: actions.GET_LINKS,
          payload,
          columnIndexes
        });
      });
  };
}

export function selectNode(id) {
  return {
    type: actions.SELECT_NODE,
    id
  };
}

export function highlightNode(id) {
  return (dispatch, getState) => {
    if (getState().flows.selectedNodesIds.indexOf(id) > -1) return;
    dispatch({
      type: actions.HIGHLIGHT_NODE,
      id
    });
  };
}
