import 'styles/components/tool/map/map-layers.scss';
import 'styles/components/tool/map/map-sidebar.scss';
import MapDimensionsTemplate from 'ejs!templates/tool/map/map-dimensions.ejs';

export default class {

  onCreated() {
    this.el = document.querySelector('.js-dimensions');
  }

  loadMapDimensions({ mapDimensionsGroups, expandedMapSidebarGroupsIds }) {
    this.el.innerHTML = MapDimensionsTemplate({groups: mapDimensionsGroups});

    this.sidebarGroups = Array.prototype.slice.call(this.el.querySelectorAll('.js-map-sidebar-group'), 0);
    this.sidebarGroupsTitles = Array.prototype.slice.call(this.el.querySelectorAll('.js-map-sidebar-group-title'), 0);
    this.sidebarGroupsTitles.forEach((sidebarGroupTitle) => {
      sidebarGroupTitle.addEventListener('click', this._onGroupTitleClicked.bind(this));
    });

    this.dimensions = Array.prototype.slice.call(this.el.querySelectorAll('.js-map-sidebar-group-item'), 0);
    this.dimensions.forEach((dimension) => {
      dimension.addEventListener('click', this._onDimensionClicked.bind(this));
    });

    this.toggleSidebarGroups(expandedMapSidebarGroupsIds);
  }

  selectMapDimensions(selectedMapDimensions) {
    if (this.dimensions === undefined) {
      return;
    }
    this.dimensions.forEach((dimension) => {
      const uid = dimension.getAttribute('data-dimension-uid');
      dimension.classList.toggle('-selected', selectedMapDimensions.indexOf(uid) !== -1);
    });
  }

  toggleSidebarGroups(expandedMapSidebarGroupsIds) {
    if (this.sidebarGroups === undefined) {
      return;
    }
    this.sidebarGroups.forEach((sidebarGroup) => {
      const id = sidebarGroup.getAttribute('data-group-id');
      sidebarGroup.classList.toggle('-expanded', expandedMapSidebarGroupsIds.indexOf(id) !== -1);
    });
  }

  _onGroupTitleClicked(event) {
    const id = event.currentTarget.parentNode.getAttribute('data-group-id');
    this.callbacks.onToggleGroup(id);
  }

  _onDimensionClicked(event) {
    const uid = event.currentTarget.getAttribute('data-dimension-uid');
    this.callbacks.onDimensionClick(uid);
  }
}
