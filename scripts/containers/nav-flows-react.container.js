import { connect } from 'preact-redux';
import Nav from 'react-components/nav-flows.component.js';

const mapStateToProps = (state) => {
  return {
    tooltips: state.app.tooltips,
    selectedContext: state.flows.selectedContext
  };
};

export default connect(
  mapStateToProps
)(Nav);
