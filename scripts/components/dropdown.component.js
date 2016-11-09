import 'styles/components/dropdown.scss';

export default class {
  constructor(id, callback, child) {
    this.id = id;
    this.callback = callback;
    this.child = child;
    this.el = document.querySelector(`[data-dropdown=${id}]`);
    this.title = this.el.querySelector('.js-dropdown-title');
    this.list = this.el.querySelector('.js-dropdown-list');
    this.list.classList.add('is-hidden');
    this.title.addEventListener('click', this._onTitleClick.bind(this));
    this.list.addEventListener('click', (e) => {
      if (e.target.getAttribute('data-value')) {
        this._onListClick(e.target.dataset);
      }
    });
  }

  selectValue(value) {
    const valueTitle =
      this.list.querySelector(`[data-value="${value}"] .js-dropdown-item-title`) ||
      this.list.querySelector(`[data-value="${value}"]`);
    this.setTitle(valueTitle.innerHTML);
  }

  setTitle(text) {
    this.title.innerHTML = text;
  }

  _onTitleClick() {
    const allDropdowns = document.querySelectorAll('.js-dropdown-list');
    for (let i = 0; i < allDropdowns.length; ++i) {
      if (allDropdowns[i].parentNode.getAttribute('data-dropdown') === this.id) {
        this._toggle();
      } else {
        allDropdowns[i].classList.add('is-hidden');
      }
    }
  }

  _toggle() {
    var isOpen = !this.list.classList.toggle('is-hidden');
    if (this.child) {
      if (isOpen) {
        this.child.onDropdownOpen();
      } else {
        this.child.onDropdownClose();
      }
    }
  }

  _close() {
    this.list.classList.add('is-hidden');
  }

  _onListClick(data) {
    if (Object.keys(data).length > 1) {
      this.callback(data, this.id);
    } else {
      this.callback(data.value, this.id);
    }
    this._close();
  }
}
