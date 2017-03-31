import { connect } from 'preact-redux';
import ColumnsSelector from 'react-components/columns-selector.component.js';

const mapStateToProps = (state) => {
  return {
    columns: state.flows.columns,
    sankeySize: state.app.sankeySize
  };
};

export default connect(
  mapStateToProps
)(ColumnsSelector);
