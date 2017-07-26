import _ from 'lodash';
import formatValue from 'utils/formatValue';
import NodeTitleTemplate from 'ejs!templates/tool/nodeTitle.ejs';
import 'styles/components/tool/nodesTitles.scss';
import TooltipTemplate from 'ejs!templates/shared/info-tooltip.ejs';

export default class {
  onCreated() {
    this.el = document.querySelector('.js-nodes-titles');
    this.tooltip = document.querySelector('.js-tool-tooltip');
    this.tooltipHideDebounced = _.debounce(this._hideTooltip, 10);
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
      this.tooltipHideDebounced();
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
    this.tooltipHideDebounced.cancel();
    const node = nodesData[0];

    if (node.selectedMetas === undefined) {
      return;
    }

    const templateValues = {
      title: node.name,
      values: []
    };

    // map metas might not be loaded yet
    if (node.selectedMetas !== undefined) {
      templateValues.values = node.selectedMetas.map(meta => {
        return {
          title: meta.name,
          unit: meta.unit,
          value: formatValue(meta.rawValue, meta.name)
        };
      }).concat(templateValues.values);
    }

    // if node is visible in sankey, quant is available
    if (node.quant !== undefined) {
      templateValues.values.push({
        title: currentQuant.name,
        unit: currentQuant.unit,
        value: formatValue(node.quant, currentQuant.name)
      });
    }

    this.tooltip.innerHTML = TooltipTemplate(templateValues);
    this.tooltip.classList.remove('is-hidden');
    this.tooltip.style.left = `${coordinates.pageX + 10}px`;
    this.tooltip.style.top = `${coordinates.pageY + 10}px`;
  }

  _hideTooltip() {
    this.tooltip.classList.add('is-hidden');
  }
}
