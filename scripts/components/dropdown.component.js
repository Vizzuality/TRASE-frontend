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
    if (this._uniqueChild()) this.el.classList.add('-unique-child');
    this._setEventListeners();
  }

  _bindMultipleEvents(eventArray, el, fn) {
    eventArray.forEach((event) => {
      el.addEventListener(event, fn);
    });
  }

  _setEventListeners() {
    this.title.addEventListener('click', () => {
      if (this.el.classList.contains('-column-selector')) {
        this.title.classList.add('-is-open');
      }
      this._onTitleClick();
    });

    this._bindMultipleEvents(['click', 'touchstart'], this.list, (e) => {
      e.preventDefault();
      if (e.target.getAttribute('data-value')) {
        this._onListClick(e.target.dataset);
      }
    });

    window.addEventListener('keyup', (event) => {
      if (event.keyCode === 27 && !this.list.classList.contains('is-hidden')) {
        this._close();
      }
    });

    this._bindMultipleEvents(['mouseup', 'touchstart'], window, (event) => {
      if (event.target === this.list) return;
      this._close();
    });
  }

  _uniqueChild() {
    return (this.list.querySelectorAll('li').length === 1);
  }

  selectValue(value) {
    // TODO friday hack, this should not happen
    if (value === undefined) {
      value = 'none';
    }
    if(this.current) this.current.classList.remove('is-hidden');

    const valueTitle =
      this.list.querySelector(`[data-value="${value}"] .js-dropdown-item-title`) ||
      this.list.querySelector(`[data-value="${value}"]`);
    this.setTitle(valueTitle.innerHTML);

    valueTitle.classList.add('is-hidden');
    this.current = valueTitle;

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
    const isOpen = !this.list.classList.toggle('is-hidden');
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

    if (this.el.classList.contains('-column-selector')) {
      this.title.classList.remove('-is-open');
    }
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
