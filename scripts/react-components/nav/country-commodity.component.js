import { h } from 'preact';
import classNames from 'classnames';
import Tooltip from 'react-components/tooltip.component';
import Dropdown from 'react-components/nav/dropdown.component';

const id = 'country-commodity';

export default ({ onToggle, onSelected, tooltips, currentDropdown, contexts, selectedContextCountry, selectedContextCommodity }) => {
  return (
    <div class='nav-item' onClick={() => { onToggle(id); }}>
      <div class='c-dropdown -capitalize'>
        <span class='dropdown-label'>
          Country - Commodity
          <Tooltip text={tooltips.sankey.nav.context.main} />
        </span>
        <span class='dropdown-title'>
          {selectedContextCountry.toLowerCase()} - {selectedContextCommodity.toLowerCase()}
        </span>
        <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={onToggle}>
          <ul class='dropdown-list -medium'>
            {contexts
              .filter(context => context.countryName !== selectedContextCountry || context.commodityName !== selectedContextCommodity)
              .map(context => <li
                class={classNames('dropdown-item', { '-disabled': context.isDisabled })}
                onClick={() => onSelected(context.id)}
                >
                {context.countryName.toLowerCase()} - {context.commodityName.toLowerCase()}
              </li>)}
          </ul>
        </Dropdown>
      </div>
    </div>
  );
};
