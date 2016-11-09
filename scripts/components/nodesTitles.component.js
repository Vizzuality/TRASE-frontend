import NodeTitleTemplate from 'ejs!templates/nodeTitle.ejs';
import 'styles/components/nodesTitles.scss';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
  }

  selectNodes(nodesData) {
    this._update(nodesData);
  }

  highlightNode(nodesData) {
    this._update(nodesData);
  }

  _update(nodesData) {
    // TODO nodesData[0] === undefined should never happen, this is a smell form the reducer
    if (nodesData === undefined || nodesData.length === 0 || nodesData[0] === undefined) return;
    this.el.innerHTML = NodeTitleTemplate({
      nodes: nodesData,
      node: nodesData[0],
      multiple: nodesData.length > 1
    });
  }

}
