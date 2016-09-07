import stringToHTML from 'utils/stringToHTML';
import BookmarkTemplate from 'templates/bookmark.handlebars';

export default class {
  constructor(settings) {
    this.el= settings.el;
    this.bookmark = settings.bookmark;
    this.actions = ['update', 'share', 'delete'];

    return this;
  }

  _setEventListener() {
    this.bookmarkItem.querySelector('.update').addEventListener('click', () => this._update());
    this.bookmarkItem.querySelector('.share').addEventListener('click', () => this._share());
    this.bookmarkItem.querySelector('.delete').addEventListener('click', () => this._delete());
  }

  _setVars() {
    this.bookmarkItem = this.el.querySelector(`[data-bookmark-id="${this.bookmark.id}"]`);
    this.optionList = this.el.querySelector('.bookmark-options');
  }

  htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
  }

  render() {
    var bookmarkHTML = stringToHTML(BookmarkTemplate({
      bookmark: this.bookmark,
      actions: this.actions
    }));

    this.el.appendChild(bookmarkHTML);

    this._setVars();
    this._setEventListener();
  }

  _update() {}

  _share() {}

  _delete() {}
}
