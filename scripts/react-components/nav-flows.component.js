import { h } from 'preact';
import CountryCommodity from 'containers/nav/country-commodity.container';
import Filters from 'containers/nav/filters.container';

const Nav = ({ tooltips, selectedContext }) => {

  if (tooltips === undefined || selectedContext === undefined) {
    return;
  }

  const hasFilters = selectedContext.filterBy && selectedContext.filterBy.length > 0;

  return (
    <nav>
      <div class='left-side'>
        <div class='nav-item'>
          <div class='offset-container js-logo'>
            <a class='trase-logo' href='/'>
              <img src='images/logos/logo-trase-small-beta.svg' alt='TRASE' />
            </a>
          </div>
        </div>

        <CountryCommodity />

        {hasFilters === true &&
          <Filters />
        }

        <div class='nav-item js-context-filters' />

        <div class='nav-item'>
          <div class='c-dropdown' data-dropdown='years'>
            <span class='dropdown-label'>years</span>
            <span class='js-dropdown-title dropdown-title'>
              -
            </span>
            <ul class='js-dropdown-list dropdown-list'>
              <div class='js-years-slider c-years-slider' />
            </ul>
          </div>
        </div>
      </div>

      <div class='right-side'>
        <div class='nav-item js-context-resizeBy' />

        <div class='nav-item -color js-context-recolorBy js-qual-dropdown' />

        <div class='nav-item js-context-view'>
          <div class='c-dropdown -small' data-dropdown='view'>
            <span class='dropdown-label'>
              Change view
              <svg class='icon tooltip-icon'>
                <use xlinkHref='#icon-layer-info' />
              </svg>
            </span>
            <span class='js-dropdown-title dropdown-title -small'>
              -
            </span>
            <ul class='js-dropdown-list dropdown-list -right'>
              <li class='js-dropdown-item dropdown-item' data-value='false'>Summary</li>
              <li class='js-dropdown-item dropdown-item' data-value='true'>Complete</li>
            </ul>
          </div>
        </div>

        <div class='nav-item js-open-search'>
          <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
