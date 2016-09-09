import 'styles/components/nav.scss';
import Dropdown from 'components/dropdown.component';
import BookmarkMenu from 'components/nav/bookmarks/bookmark-menu.component';
import ShareMenu from 'components/nav/share/share-menu.component';
import SettingsMenu from 'components/nav/settings/settings-menu.component';

export default class {
  onCreated() {

    this.countryDropdown = new Dropdown('country', this.callbacks.onIndicatorSelected);
    this.indicatorDropdown = new Dropdown('indicator', this.callbacks.onIndicatorSelected);
    new BookmarkMenu();
    new ShareMenu();
    new SettingsMenu();
  }

  selectIndicator(value) {
    this.indicatorDropdown.selectValue(value);
  }
}
