import 'styles/components/dropdown.scss';

export default class {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
    this.el = document.querySelector(`[data-dropdown=${id}]`);
    this.title = this.el.querySelector('.js-dropdown-title');
    this.list = this.el.querySelector('.js-dropdown-list');
    this.list.classList.add('is-hidden');
    this.title.addEventListener('click', this._onTitleClick.bind(this));
    this.list.addEventListener('click', (e) => {
      if (e.target.getAttribute('data-value')) {
        this._onListClick(e.target.getAttribute('data-value'), e.target.innerHTML);
      }
    });
  }

  selectValue(value) {
    this.title.innerHTML = this.list.querySelector(`[data-value="${value}"]`).innerHTML;
  }

  _onTitleClick() {
    const allDropdowns = document.querySelectorAll('.js-dropdown-list');
    for (let i = 0; i < allDropdowns.length; ++i) {
      if (allDropdowns[i].parentNode.getAttribute('data-dropdown') === this.id) {
        allDropdowns[i].classList.toggle('is-hidden');
      } else {
        allDropdowns[i].classList.add('is-hidden');
      }
    }
  }

  _close() {
    this.list.classList.add('is-hidden');
  }

  _onListClick(value) {
    this.callback(value);
    this._close();
  }
}
