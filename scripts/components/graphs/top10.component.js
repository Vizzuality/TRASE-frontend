import Top10Template from 'ejs!templates/graphs/top10.ejs';
import getFactSheetLink from 'utils/getFactSheetLink';

export default class {
  constructor(el, title, list, columnId = -1) {
    list.forEach(node => {
      node.link = getFactSheetLink(node.id, columnId);
      node.formattedValue = parseFloat(node.value) * 100;

      if (node.formattedValue < .1) {
        node.formattedValue = '< 0.1';
      } else {
        node.formattedValue = node.formattedValue.toFixed(1);
      }
    });

    const top10HTML = Top10Template({
      list,
      title
    });

    el.innerHTML = top10HTML;
  }
}
