import { h } from 'preact';
import Tooltip from 'react-components/tooltip.component';

export default ({ onToggle, onSelected, currentDropdown, tooltips, isDetailedView }) => {
  const title = (isDetailedView === true) ? 'Complete' : 'Summary';
  const other = (isDetailedView === true) ? 'Summary' : 'Complete';
  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -small'>
        <span class='dropdown-label'>
          Change view
          <Tooltip text={tooltips.sankey.nav.view.main} />
        </span>
        <span class='dropdown-title'>
          {title}
        </span>
        {currentDropdown === 'view' &&
          <ul class='dropdown-list -right'>
            <li
              class='dropdown-item'
              onClick={() => onSelected(!isDetailedView)}>
              {other}
            </li>
          </ul>
        }
      </div>
    </div>
  );
};
