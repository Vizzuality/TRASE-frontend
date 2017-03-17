import stringToHTML from 'utils/stringToHTML';
import BookmarkTemplate from 'ejs!templates/bookmark.ejs';

export default class {
  constructor(settings) {
    this.el = settings.el;
    this.bookmark = settings.bookmark;
    this.actions = ['update', 'share-bookmark', 'delete'];

    return this;
  }

  _setEventListeners() {
    this.bookmarkItem.querySelector('.update').addEventListener('click', () => this._update());
    this.bookmarkItem.querySelector('.share-bookmark').addEventListener('click', () => this._share());
    this.bookmarkItem.querySelector('.delete').addEventListener('click', () => this._delete());
  }

  _setVars() {
    this.bookmarkItem = this.el.querySelector(`[data-bookmark-id="${this.bookmark.id}"]`);
    this.optionList = this.el.querySelector('.bookmark-options');
  }

  render() {

    var bookmarkHTML = stringToHTML(BookmarkTemplate({
      bookmark: this.bookmark, actions: this.actions
    }));

    this.el.appendChild(bookmarkHTML[0]);

    this._setVars();
    this._setEventListeners();
  }

  _update() {
  }

  _share() {
  }

  _delete() {
  }
}
