import NodeTitleTemplate from 'ejs!templates/nodeTitle.ejs';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
  }

  update(nodesData) {
    console.log(nodesData);
    this.el.innerHTML = NodeTitleTemplate({
      nodes: nodesData,
      node: nodesData[0],
      multiple: nodesData.length > 1
    });
  }
}
