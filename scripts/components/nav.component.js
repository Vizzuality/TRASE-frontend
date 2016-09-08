import 'styles/components/nav.scss';
import Dropdown from 'components/dropdown.component';
import BookmarkMenu from 'components/nav/bookmarks/bookmark-menu.component';

export default class {
  onCreated() {

    this.countryDropdown = new Dropdown('country', this.callbacks.onIndicatorSelected);
    this.indicatorDropdown = new Dropdown('indicator', this.callbacks.onIndicatorSelected);
    this.bookmarkMenu = new BookmarkMenu();
  }

  selectIndicator(value) {
    this.indicatorDropdown.selectValue(value);
  }
}
