
import Dropdown from 'scripts/components/dropdown.component';

import { json as d3_json } from 'd3-request';

import 'styles/homepage.scss';

const defaults = {
  commodity: 'Soy',
  country: 'Brazil'
};

const _setMap = function() {
  const imagesItem = document.querySelectorAll('.map-gallery-item');
  const defaultCommodity = defaults.commodity.toLowerCase();
  const defaultCountry = defaults.country.toLowerCase();

  d3_json('homepage/maps.json', (err, response) => {
    const res = response.maps.filter((r) => {
      return r.commodity === defaultCommodity && r.country === defaultCountry;
    });

    if (!res[0]) return;

    const imageName = res[0]['image_name'];

    imagesItem.forEach((imageItem) => {
      if (imageItem.getAttribute('data-image-name') === imageName) {
        imageItem.classList.remove('is-hidden');
      } else {
        if (!imageItem.classList.contains('is-hidden')) {
          imageItem.classList.add('is-hidden');
        }
      }
    });
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
