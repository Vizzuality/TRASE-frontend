import TableTemplate from 'ejs!templates/table/table.ejs';

export default class {
  constructor() {

    var actors = [
      {munici: 'Campo Novo', trade: '1,320', defo: '1,320'},
      {munici: 'Maracaju', trade: '1,065', defo: '1,965'},
      {munici: 'Barreiras', trade: '837', defo: '893'},
    ];

    this.data = actors;

    this.render();
  }

  onCreated() {
    debugger
    this.render();
  }

  render() {

    // const template = new TableTemplate({actors: this.data});
    // debugger
    console.log(new TableTemplate());
  }
}
