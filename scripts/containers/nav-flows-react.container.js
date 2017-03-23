import { connect } from 'preact-redux';
import Nav from 'components/nav/nav-flows-react.component.js';

const mapStateToProps = (state) => {
  // console.log(state)
  return {
    text: state.flows.selectedYears[0]
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
