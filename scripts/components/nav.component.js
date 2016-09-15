import 'styles/components/nav.scss';
import Dropdown from 'components/dropdown.component';
import BookmarkMenu from 'components/nav/bookmarks/bookmark-menu.component';
import ShareMenu from 'components/nav/share/share-menu.component';

export default class {
  onCreated() {

    this.countryDropdown = new Dropdown('country', this.callbacks.onCountrySelected);
    this.indicatorDropdown = new Dropdown('indicator', this.callbacks.onIndicatorSelected);

    new BookmarkMenu();
    new Dropdown('bookmark', this.callbacks.onIndicatorSelected);
    const shareMenu = new ShareMenu();
    new Dropdown('share', this.callbacks.onIndicatorSelected, shareMenu);
  }

  selectIndicator(value) {
    this.indicatorDropdown.selectValue(value);
  }

  selectCountry(value) {
    this.countryDropdown.selectValue(value);
  }
}
