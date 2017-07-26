import formatValue from 'utils/formatValue';
import NodeTitleTemplate from 'ejs!templates/tool/nodeTitle.ejs';
import 'styles/components/tool/nodesTitles.scss';
import Tooltip from 'components/shared/info-tooltip.component';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
    this.tooltip = new Tooltip('.js-tool-tooltip');
  }

  selectNodes(data) {
    this._update(true, data.nodesData, data.recolorGroups, data.currentQuant);
  }

  highlightNode({ isHighlight, nodesData, recolorGroups, coordinates, isMapVisible, currentQuant }) {
    if (nodesData === undefined || !nodesData.length) {
      return;
    }
    // when map is full screen, show data as a tooltip instead of a nodeTitle
    if (coordinates !== undefined) {
      this._showTooltip(nodesData, coordinates, currentQuant);
    } else {
      this.tooltip.hide();
    }

    // TODO nodesData[0] === undefined should never happen, this is a smell form the reducer
    if (nodesData === undefined || nodesData.length === 0 || nodesData[0] === undefined) {
      this.el.classList.add('is-hidden');
    } else {
      if (isMapVisible === false) {
        this.el.classList.remove('is-hidden');
        this._update(!isHighlight, nodesData, recolorGroups, currentQuant);
      }
    }
  }

  _update(isSelect, nodesData, recolorGroups = null, currentQuant) {
    const templateData = {
      nodes: nodesData.map(node => {
        let renderedQuant;
        if (node.quant !== undefined) {
          renderedQuant = {
            valueNice: formatValue(node.quant, currentQuant.name),
            unit: currentQuant.unit,
            name: currentQuant.name,
          };
        }

        let renderedMetas;
        if (node.selectedMetas !== undefined) {
          renderedMetas = node.selectedMetas.map(originalMeta => ({
            valueNice: formatValue(originalMeta.rawValue, originalMeta.name),
            name: originalMeta.name,
            unit: originalMeta.unit,
          }));
        }

        const renderedNode = Object.assign(node, {}, {
          hasLink: node.isUnknown !== true && node.isDomesticConsumption !== true && node.profileType !== undefined && node.profileType !== null,
          selectedMetas: renderedMetas,
          renderedQuant
        });

        return renderedNode;
      }),
      isSelect: isSelect || nodesData.length > 1,
      recolorGroups: recolorGroups
    };

    this.el.innerHTML = NodeTitleTemplate(templateData);

    const nodeTitles = Array.prototype.slice.call(document.querySelectorAll('.js-node-title.-link'), 0);
    nodeTitles.forEach((nodeTitle) => {
      nodeTitle.addEventListener('click', (e) => {
        this.callbacks.onProfileLinkClicked(parseInt(e.currentTarget.dataset.nodeId));
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

  _showTooltip(nodesData, coordinates, currentQuant) {
    const node = nodesData[0];

    if (node.selectedMetas === undefined) {
      return;
    }

    let values = [];

    // map metas might not be loaded yet
    if (node.selectedMetas !== undefined) {
      values = node.selectedMetas.map(meta => {
        return {
          title: meta.name,
          unit: meta.unit,
          value: formatValue(meta.rawValue, meta.name)
        };
      }).concat(values);
    }

    // if node is visible in sankey, quant is available
    if (node.quant !== undefined) {
      values.push({
        title: currentQuant.name,
        unit: currentQuant.unit,
        value: formatValue(node.quant, currentQuant.name)
      });
    }

    this.tooltip.show(coordinates.pageX + 10, coordinates.pageY + 10, node.name, values);
  }
}
