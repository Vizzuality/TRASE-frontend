import { h } from 'preact';
import CountryCommodity from 'containers/nav/country-commodity.container';
import Filters from 'containers/nav/filters.container';
import Years from 'containers/nav/years.container';
import ResizeBy from 'containers/nav/resize-by.container';
import RecolorBy from 'containers/nav/recolor-by.container';

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

        <Years />
      </div>

      <div class='right-side'>
        <ResizeBy />
        <RecolorBy />

        <div class='nav-item -color js-context-recolorBy js-qual-dropdown' />

        <div class='nav-item js-open-search'>
          <svg class='icon icon-search'><use xlinkHref='#icon-search' /></svg>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
