import NodeTitleTemplate from 'ejs!templates/nodeTitle.ejs';
import 'styles/components/nodesTitles.scss';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
  }

  selectNodes(data) {
    this._update(true, data.nodesData, data.recolorGroups);
  }

  highlightNode(data) {
    this._update(!data.isHighlight, data.nodesData, data.recolorGroups);
  }

  _update(isSelect, nodesData, recolorGroups = null) {
    // TODO nodesData[0] === undefined should never happen, this is a smell form the reducer
    if (nodesData === undefined || nodesData.length === 0 || nodesData[0] === undefined) return;
    this.el.innerHTML = NodeTitleTemplate({
      nodes: nodesData,
      isSelect: isSelect || nodesData.length > 1,
      recolorGroups: recolorGroups
    });

    const nodeTitles = Array.prototype.slice.call(document.querySelectorAll('.js-node-title'), 0);
    nodeTitles.forEach((nodeTitle) => {
      nodeTitle.addEventListener('click', (e) => {
        if (e.currentTarget.dataset.nodeLink !== undefined) {
          window.location.href = e.currentTarget.dataset.nodeLink;
        }
      });
    });

    const closeButtons = Array.prototype.slice.call(document.querySelectorAll('.js-node-close'), 0);
    closeButtons.forEach((closeButton) => {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.callbacks.onCloseNodeClicked(parseInt(e.currentTarget.dataset.nodeId));
      });
    });
  }
}
