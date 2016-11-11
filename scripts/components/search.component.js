import 'styles/components/search.scss';
import Awesomplete from 'awesomplete';
import 'awesomplete/awesomplete.css';


export default class {
  onCreated() {
    this.el = document.querySelector('.js-search');
    this.input = this.el.querySelector('.js-search-input');
    this.autocomplete = new Awesomplete(this.input, {
      data: node => {
        return {
          label: node.name.toLowerCase(),
          value: JSON.stringify({
            id: node.id,
            name: node.name.toLowerCase(),
            columnName: node.columnName.toLowerCase()
          })
        };
      },
      item: (text, input) => {
        let html;
        if (input === '') {
          html = text;
        } else {
          // next two lines are borrowed from awesomeplete's default ._ITEM implementation
          const s = input.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
          html = text.replace(RegExp(s, 'gi'), '<mark>$&</mark>');
          html = `<span class="node-name">${html}</span>`;

          const value = JSON.parse(text.value);
          html += `<span class="node-type">${value.columnName}</span>`;
        }
        const dom = document.createElement('li');
        dom.innerHTML = html;
        return dom;
      },
      // sets the value that appear in the input when selecting a list item
      // needs to be overriden because by default it will spit the whole item html
      replace: text => {
        this.input.value = text;
      }
    });

    this.input.addEventListener('awesomplete-selectcomplete', this._onAutocompleteSelected.bind(this));
  }

  loadNodes(nodes) {
    this.autocomplete.list = nodes;
  }

  _onAutocompleteSelected(event) {
    const nodeId = parseInt(JSON.parse(event.text.value).id);
    this.callbacks.onNodeSelected(nodeId);
  }

}
