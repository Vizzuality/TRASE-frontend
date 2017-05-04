import 'styles/components/tool/map/map-layers.scss';
import 'styles/components/shared/switcher.scss';
import MapDimensionsTemplate from 'ejs!templates/tool/map/map-dimensions.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-dimensions');
  }

  loadMapDimensions(mapDimensionsGroups) {
    console.log(mapDimensionsGroups);
    this.el.innerHTML = MapDimensionsTemplate({groups: mapDimensionsGroups});
  }

  selectMapDimensions(selectedMapDimensions) {
    console.log(selectedMapDimensions)
  }
}
