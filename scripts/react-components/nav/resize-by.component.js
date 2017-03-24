import { h } from 'preact';
import classNames from 'classnames';

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
            <svg
              class='icon tooltip-icon js-tooltip'
              data-tooltip-text={tooltips.sankey.nav.resizeBy[resizeBy.name]}
              data-tooltip-position='top right'
            >
              <use xLinkHref='#icon-layer-info' />
            </svg>
          }
        </li>);
      });
  }


  return (
    <div class='nav-item' onClick={onToggle}>
      <div class='c-dropdown -small -capitalize'>
        <span class='dropdown-label'>
          Resize
          <svg
            class='icon tooltip-icon js-tooltip'
            data-tooltip-text={tooltips.sankey.nav.resizeBy.main}
            data-tooltip-position='top right'
          >
            <use xLinkHref='#icon-layer-info' />
          </svg>
        </span>
        <span class='dropdown-title -small'>
          {selectedResizeBy.label.toLowerCase()}
        </span>
        {currentDropdown === 'resize-by' &&
          <ul class='dropdown-list'>
            {resizeByElements}
          </ul>
        }
      </div>
    </div>
  );
};
