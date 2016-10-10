import NodeTitleTemplate from 'ejs!templates/nodeTitle.ejs';
import 'styles/components/nodesTitles.scss';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
  }

  update(nodesData) {
    if (nodesData.length === 0) return;
    console.log(nodesData);
    this.el.innerHTML = NodeTitleTemplate({
      nodes: nodesData,
      node: nodesData[0],
      multiple: nodesData.length > 1
    });
  }
}
