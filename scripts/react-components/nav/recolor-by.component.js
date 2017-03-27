import { h } from 'preact';
import classNames from 'classnames';
import _ from 'lodash';
import Tooltip from 'react-components/tooltip.component';

export default ({ tooltips, onToggle, onSelected, currentDropdown, selectedRecolorBy, recolorBys }) => {
  recolorBys.sort((a, b) => (a.groupNumber === b.groupNumber) ? (a.position > b.position) : (a.groupNumber > b.groupNumber));

  const getDropdownItem = (recolorBy) => {
    return <li
      class={classNames('dropdown-item', { '-disabled': recolorBy.isDisabled })}
      onClick={() => onSelected(recolorBy)}
    >
      <div class='dropdown-item-title'>
        {recolorBy.label}
        {recolorBy.name && tooltips.sankey.nav.colorBy[recolorBy.name] &&
          <Tooltip position='bottom right' text={tooltips.sankey.nav.colorBy[recolorBy.name]} />
        }
      </div>
      {recolorBy.minValue &&
        <span class='dropdown-item-legend-unit -left'>{recolorBy.minValue}</span>
      }
      {recolorBy.legendType &&
      <ul class={classNames('dropdown-item-legend', `-${recolorBy.legendType}`)}>
        {((recolorBy.nodes.length > 0) ? recolorBy.nodes : [...Array(recolorBy.intervalCount).keys()])
          .map(legendItem => {
            const id = (_.isNumber(legendItem)) ? legendItem : legendItem.toLowerCase();
            const className = `-${recolorBy.type.toLowerCase()}-${recolorBy.legendType.toLowerCase()}-${recolorBy.legendColorTheme.toLowerCase()}-${id}`.replace(/ /g, '-');
            return <li class={className}>
              {!_.isNumber(legendItem) && legendItem}
            </li>;
          })
        }
      </ul>
      }
      {recolorBy.maxValue &&
        <span class='dropdown-item-legend-unit -right'>{recolorBy.maxValue}</span>
      }
    </li>;
  };

  let recolorByElements = [];
  if (currentDropdown === 'recolor-by') {
    [{ label: 'Node selection', name: 'none' }]
      .concat(recolorBys)
      .forEach((recolorBy, index, currentRecolorBys) => {
        if (index > 0 && currentRecolorBys[index - 1].groupNumber !== recolorBy.groupNumber) {
          recolorByElements.push(<li class='dropdown-item -separator' />);
        }
        recolorByElements.push(getDropdownItem(recolorBy));
      });
  }

  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -small -capitalize'>
        <span class='dropdown-label'>
          Recolor by
          <Tooltip position='top right' text={tooltips.sankey.nav.colorBy.main} />
        </span>
        <span class='dropdown-title -small'>
          {selectedRecolorBy.label || 'Node selection'}
        </span>
        {currentDropdown === 'recolor-by' &&
          <ul class='dropdown-list -large'>
            {recolorByElements}
          </ul>
        }
      </div>
    </div>
  );
};
