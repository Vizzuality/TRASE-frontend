import { h } from 'preact';
import classNames from 'classnames';
import Tooltip from 'react-components/tooltip.component';

export default ({ tooltips, onToggle, onSelected, currentDropdown, selectedResizeBy, resizeBys }) => {
  resizeBys.sort((a, b) => a.position > b.position);
  let resizeByElements = [];
  if (currentDropdown === 'resize-by') {
    resizeBys
      .filter(resizeBy => resizeBy.name !== selectedResizeBy.name)
      .forEach((resizeBy, index, currentResizeBys) => {
        if (index > 0 && currentResizeBys[index - 1].groupNumber !== resizeBy.groupNumber) {
          resizeByElements.push(<li class='dropdown-item -separator' />);
        }
        resizeByElements.push(<li
          class={classNames('dropdown-item', { '-disabled': resizeBy.isDisabled })}
          onClick={() => onSelected(resizeBy.name)}
          >
          {resizeBy.label.toLowerCase()}
          {resizeBy.name && tooltips.sankey.nav.resizeBy[resizeBy.name] &&
            <Tooltip position='bottom right' text={tooltips.sankey.nav.resizeBy[resizeBy.name]} />
          }
        </li>);
      });
  }


  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -small -capitalize'>
        <span class='dropdown-label'>
          Resize
          <Tooltip position='top right' text={tooltips.sankey.nav.resizeBy.main} />
        </span>
        <span class='dropdown-title -small'>
          {selectedResizeBy.label.toLowerCase()}
          {selectedResizeBy.name && tooltips.sankey.nav.resizeBy[selectedResizeBy.name] &&
            <Tooltip position='bottom right' text={tooltips.sankey.nav.resizeBy[selectedResizeBy.name]} />
          }
        </span>
        {resizeByElements.length > 0 &&
          <ul class='dropdown-list'>
            {resizeByElements}
          </ul>
        }
      </div>
    </div>
  );
};
