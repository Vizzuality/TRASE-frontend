import connect from 'connect';
import Tooltip from 'components/shared/tooltip.component.js';

const mapMethodsToState = (state) => ({
  checkTooltip: state.app.tooltipCheck,
});

export default connect(Tooltip, mapMethodsToState);
