import 'styles/components/tool/map/map-layers.scss';
import 'styles/components/tool/map/map-sidebar.scss';
import 'styles/components/shared/switcher.scss';
import MapDimensionsTemplate from 'ejs!templates/tool/map/map-dimensions.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-dimensions');
  }

  loadMapDimensions({ mapDimensionsGroups, expandedMapSidebarGroupsIds }) {
    console.log(mapDimensionsGroups);
    this.el.innerHTML = MapDimensionsTemplate({groups: mapDimensionsGroups});

    this.sidebarGroups = Array.prototype.slice.call(this.el.querySelectorAll('.js-map-sidebar-group'), 0);
    this.sidebarGroupsTitles = Array.prototype.slice.call(this.el.querySelectorAll('.js-map-sidebar-group-title'), 0);
    this.sidebarGroupsTitles.forEach((sidebarGroupTitle) => {
      sidebarGroupTitle.addEventListener('click', this._onGroupTitleClicked.bind(this));
    });

    this.toggleSidebarGroups(expandedMapSidebarGroupsIds);
  }

  selectMapDimensions(selectedMapDimensions) {
    console.log(selectedMapDimensions)
  }

  toggleSidebarGroups(expandedMapSidebarGroupsIds) {
    console.log(expandedMapSidebarGroupsIds)
    if (this.sidebarGroups === undefined) {
      return;
    }
    this.sidebarGroups.forEach((sidebarGroup) => {
      const id = sidebarGroup.getAttribute('data-group-id');
      sidebarGroup.classList.toggle('-expanded', expandedMapSidebarGroupsIds.indexOf(id) !== -1)
    });
  }

  _onGroupTitleClicked(event) {
    const id = event.currentTarget.parentNode.getAttribute('data-group-id');
    this.callbacks.onToggleGroup(id);
  }
}
