import { h } from 'preact';
import classNames from 'classnames';
import Tooltip from 'react-components/tooltip.component';

export default ({ tooltips, onToggle, onSelected, currentDropdown, selectedRecolorBy, recolorBys }) => {
  let recolorByElements = [];
  console.log(recolorBys)
  if (currentDropdown === 'recolor-by') {
    [{ label: 'Node selection', name: 'none' }]
      .concat(recolorBys)
      .forEach((recolorBy, index, currentRecolorBys) => {
        if (index > 0 && currentRecolorBys[index - 1].groupNumber !== recolorBy.groupNumber) {
          recolorByElements.push(<li class='dropdown-item -separator' />);
        }
        recolorByElements.push(<li
          class={classNames('dropdown-item', { '-disabled': recolorBy.isDisabled })}
          onClick={() => onSelected(recolorBy)}
          >
          {recolorBy.label}
          {recolorBy.name && tooltips.sankey.nav.colorBy[recolorBy.name] &&
            <Tooltip position='bottom right' text={tooltips.sankey.nav.colorBy[recolorBy.name]} />
          }
        </li>);
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
          <ul class='dropdown-list'>
            {recolorByElements}
          </ul>
        }
      </div>
    </div>
  );
}
