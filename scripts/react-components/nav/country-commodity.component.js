import { h } from 'preact';
import classNames from 'classnames';

export default ({ onToggle, onSelected, tooltips, currentDropdown, contexts, selectedContextCountry, selectedContextCommodity }) => {
  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -capitalize'>
        <span class='dropdown-label'>
          Country - Commodity
          <svg class='icon tooltip-icon js-tooltip' data-tooltip-text={tooltips.sankey.nav.context.main}>
            <use xlinkHref='#icon-layer-info' />
          </svg>
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
