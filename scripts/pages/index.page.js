
import Dropdown from 'scripts/components/dropdown.component';

import 'styles/homepage.scss';

const mapDefaults = {
  commodity: 'Soy',
  country: 'Brazil'
};

const _setMap = function() {
  const imagesItem = document.querySelectorAll('.map-gallery-item');
  const commodity = mapDefaults.commodity.toLowerCase();
  const country = mapDefaults.country.toLowerCase();
  const imageName = `${commodity}-${country}`;

  imagesItem.forEach((imageItem) => {
    imageItem.classList.toggle('is-hidden', imageItem.getAttribute('data-image-name') !== imageName);
  });
};


const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  mapDefaults[this.id] = value;

  // change map image based on new values
  _setMap();
};


const commodityDropdown = new Dropdown('commodity', _onSelect);
const countryDropdown = new Dropdown('country', _onSelect);

commodityDropdown.setTitle(mapDefaults.commodity);
countryDropdown.setTitle(mapDefaults.country);
_setMap();
