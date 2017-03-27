import { h } from 'preact';
import classNames from 'classnames';
import Tooltip from 'react-components/tooltip.component';

export default ({ onToggle, onSelected, tooltips, currentDropdown, contexts, selectedContextCountry, selectedContextCommodity }) => {
  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -capitalize'>
        <span class='dropdown-label'>
          Country - Commodity
          <Tooltip text={tooltips.sankey.nav.context.main} />
        </span>
        <span class='dropdown-title'>
          {selectedContextCountry.toLowerCase()} - {selectedContextCommodity.toLowerCase()}
        </span>
        {currentDropdown === 'country-commodity' &&
          <ul class='dropdown-list'>
            {contexts
              .filter(context => context.countryName !== selectedContextCountry || context.commodityName !== selectedContextCommodity)
              .map(context => <li
                class={classNames('dropdown-item', { '-disabled': context.isDisabled })}
                onClick={() => onSelected(context.id)}
                >
                {context.countryName.toLowerCase()} - {context.commodityName.toLowerCase()}
              </li>)}
          </ul>
        }
      </div>
    </div>
  );
};
