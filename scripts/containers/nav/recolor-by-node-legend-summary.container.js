import { connect } from 'preact-redux';
import RecolorByNodeLegendSummary from 'react-components/nav/recolor-by-node-legend-summary.component.js';

const mapStateToProps = (state) => {
  return {
    // TODO state.flows.recolorGroups should probably be cleaned up of all undefined values in the state
    recolorGroups: state.flows.recolorGroups && state.flows.recolorGroups.filter(c => c !== undefined)
  };
};

export default connect(
  mapStateToProps
)(RecolorByNodeLegendSummary);
