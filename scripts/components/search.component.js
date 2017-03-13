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
          const value = JSON.parse(text.value);
          html = `<span class="node-type">${value.columnName}</span>`;

          const s = input.trim().replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
          html += `<span class="node-name">${text.replace(RegExp(s, 'gi'), '<mark>$&</mark>')}</span>`;
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
  }

  loadEvents() {
    this.launcher = document.querySelector('.js-open-search');
    this.closer = document.querySelector('.js-close-search');

    this.launcher.addEventListener('click', this._openSearch.bind(this));
    this.closer.addEventListener('click', this._closeSearch.bind(this));
    this.input.addEventListener('awesomplete-selectcomplete', this._onAutocompleteSelected.bind(this));
  }

  loadNodes(nodes) {
    this.autocomplete.list = nodes;
  }

  _onAutocompleteSelected(event) {
    this._closeSearch();
    const node = JSON.parse(event.text.value);
    this.callbacks.onNodeSelected(node.id, node.columnName);
  }

  _openSearch() {
    this.input.value = '';
    this.el.classList.remove('is-hidden');
    this.input.focus();
  }

  _closeSearch() {
    this.el.classList.add('is-hidden');
  }

}
