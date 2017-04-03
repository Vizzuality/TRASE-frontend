// non-react tooltips needs to be instanciated at each rerender,
// so this higher-order component will just call the tether tooltip init after each render of the child component
// TODO this helper + the tether tooltip should be changed to a full-react solution
import { h, Component } from 'preact';
import Tooltip from 'components/tooltip.component';

export default function loadTooltips(ChildComponent) {
  class TooltipWrapper extends Component {
    componentDidUpdate() {
      (new Tooltip()).checkTooltip();
    }
    render() {
      return <ChildComponent {...this.props} />;
    }
  }
  return TooltipWrapper;
}
