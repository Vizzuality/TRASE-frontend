import { connect } from 'preact-redux';
import Nav from 'react-components/nav-flows.component.js';

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    tooltips: state.app.tooltips,
    selectedContext: state.flows.selectedContext
  };
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {
    onTodoClick: (text) => {
      console.log('pouet');
      console.log(text);
      // dispatch(toggleTodo(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
