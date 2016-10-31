import Top10Template from 'ejs!templates/graphs/top10.ejs';

export default class {
  constructor(el, list) {
    const top10HTML = Top10Template({
      list
    });

    el.innerHTML = top10HTML;
  }
}
