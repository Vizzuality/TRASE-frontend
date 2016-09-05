import 'styles/components/nav.scss';
import Dropdown from 'components/dropdown.component';

export default class {
  onCreated() {
    this.countryDropdown = new Dropdown('country', this.callbacks.onIndicatorSelected);
    this.indicatorDropdown = new Dropdown('indicator', this.callbacks.onIndicatorSelected);
  }

  selectIndicator(value) {
    this.indicatorDropdown.selectValue(value);
  }
}
