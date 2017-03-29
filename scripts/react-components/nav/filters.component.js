import { h } from 'preact';
import classNames from 'classnames';

export default ({ onToggle, onSelected, currentDropdown, selectedFilter, filters }) => {
  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -capitalize'>
        <span class='dropdown-label'>
          {filters.name.toLowerCase()}
        </span>
        <span class='dropdown-title'>
          {(selectedFilter !== undefined && selectedFilter.name !== undefined) ? selectedFilter.name.toLowerCase() : 'All'}
        </span>
        {currentDropdown === 'filters' &&
          <ul class='dropdown-list -medium'>
            {[{ value: 'none' }]
              .concat(filters.nodes)
              .filter(node => node.name !== selectedFilter.name)
              .map(node => <li
                class={classNames('dropdown-item', { '-disabled': node.isDisabled })}
                onClick={() => onSelected(node.name || node.value)}
                >
                {(node.name !== undefined) ? node.name.toLowerCase() : 'All' }
              </li>)}
          </ul>
        }
      </div>
    </div>
  );
};
