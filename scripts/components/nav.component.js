import 'styles/components/nav.scss';
import Dropdown from 'components/dropdown.component';
import BookmarkMenu from 'components/nav/bookmarks/bookmark-menu.component';
import ShareMenu from 'components/nav/share/share-menu.component';

export default class {
  onCreated() {

    this.countryDropdown = new Dropdown('country', this.callbacks.onCountrySelected);
    this.quantDropdown = new Dropdown('quant', this.callbacks.onQuantSelected);

    new BookmarkMenu();
    new Dropdown('bookmark', this.callbacks.onQuantSelected);
    new ShareMenu();
    new Dropdown('share');
  }

  selectQuant(value) {
    this.quantDropdown.selectValue(value);
  }

  selectCountry(value) {
    this.countryDropdown.selectValue(value);
  }
}
