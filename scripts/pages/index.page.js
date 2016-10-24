
import Dropdown from 'scripts/components/dropdown.component';

import 'styles/homepage.scss';

const defaults = {
  commodity: 'Soy',
  country: 'Brazil'
};

const _setMap = function() {
  const imagesItem = document.querySelectorAll('.map-gallery-item');
  const commodity = defaults.commodity.toLowerCase();
  const country = defaults.country.toLowerCase();
  const imageName = `${commodity}-${country}`;

  imagesItem.forEach((imageItem) => {
    if (imageItem.getAttribute('data-image-name') === imageName) {
      imageItem.classList.remove('is-hidden');
    } else {
      if (!imageItem.classList.contains('is-hidden')) {
        imageItem.classList.add('is-hidden');
      }
    }
  });

};


const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;

  // change map image based on new values
  _setMap();
};


const commodityDropdown = new Dropdown('commodity', _onSelect);
const countryDropdown = new Dropdown('country', _onSelect);

commodityDropdown.setTitle(defaults.commodity);
countryDropdown.setTitle(defaults.country);
_setMap();
