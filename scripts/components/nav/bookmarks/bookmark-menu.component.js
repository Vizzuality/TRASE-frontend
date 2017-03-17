import Bookmark from 'components/nav/bookmarks/bookmark-item.component';
import 'styles/components/nav/bookmark-dropdown.scss';
import 'styles/components/button.scss';

export default class {
  constructor() {

    // sample bookmark array. This class should receive or get
    // the bookmarks throught cookies or localStorage.
    var bookmarks = [{ id: '1234', name: 'bookmark 1', state: '943875498357' }, {
      id: '4567',
      name: 'bookmark 2',
      state: '23322321132'
    }, { id: '7890', name: 'bookmark 3', state: '98798878798' },];

    this.data = bookmarks;

    this._setVars();
    this.render();
    this._setEventListeners();
  }

  _setEventListeners() {
    this.el.querySelector('.add-bookmark').addEventListener('click', () => this._addBookmark());
  }

  _setVars() {
    this.el = document.querySelector('.js-bookmark');
    this.dropdown = this.el.querySelector('.js-dropdown-list');
    this.bookmarkList = this.dropdown.querySelector('.bookmark-list');
  }

  render() {
    this.data.forEach((bookmark) => {
      new Bookmark({
        el: this.bookmarkList, bookmark: bookmark
      }).render();
    });
  }

  _addBookmark() {
  }
}
