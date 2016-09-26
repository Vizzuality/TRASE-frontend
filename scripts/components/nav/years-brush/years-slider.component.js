import Brush from 'components/nav/years-brush/brush.component';

export default class {
  constructor(id, callback) {
    this.id = id;
    // this.data = data;
    this.callback = callback;

    this.render();
  }

  render () {
    return new Brush({
      id: this.id,
      data: this.data,
      callback: this.callback
    });
  }
}
