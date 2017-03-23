import { h, render } from 'preact';
import Nav from 'components/nav/nav-flows-react.component';

export default class {
  onCreated() {
    render(<Nav />, document.getElementById('js-flows-nav-react'));
  }
}
