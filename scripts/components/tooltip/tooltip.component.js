import TooltipTemplate from 'ejs!templates/tooltip/tooltip.ejs';
import 'whatwg-fetch';

export default class {
  constructor() {
    // this.data = null;
    // this.getData()
    //   .then(response => response.json())
    //   .then((json) => {
    //     this.data = json;
    //     this.render(value);
    //   });
    this.render();
  }
  //
  // getData() {
  //   return fetch('factsheets/table.json');
  // }

  render() {
    var contenttooltip = document.querySelector('.c-basemap-options');
    const template = TooltipTemplate();
    contenttooltip.innerHTML = template;
  }
}
