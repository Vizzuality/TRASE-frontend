import _ from 'lodash';
import { select as d3_select /*, selectAll as d3_selectAll*/ } from 'd3-selection';
import { event as d3_event } from 'd3-selection';
import  'd3-transition';
import { DETAILED_VIEW_MIN_LINK_HEIGHT, SANKEY_TRANSITION_TIME } from 'constants';
import formatValue from 'utils/formatValue';
import addSVGDropShadowDef from 'utils/addSVGDropShadowDef';
import sankeyLayout from './sankey.d3layout.js';
import 'styles/components/tool/sankey.scss';
import TooltipTemplate from 'ejs!templates/shared/tooltip.ejs';
import 'styles/components/shared/info-tooltip.scss';
import 'styles/components/tool/node-menu.scss';


export default class {

  onCreated() {
    this._build();
  }

  resizeViewport({ selectedNodesIds, shouldRepositionExpandButton, selectedRecolorBy, currentQuant, sankeySize }) {
    this.layout.setViewportSize(sankeySize);

    if (this.layout.relayout()) {
      this._render(selectedRecolorBy, currentQuant);
      if (shouldRepositionExpandButton) this._repositionExpandButton(selectedNodesIds);
    }
  }

  showLoadedLinks(linksPayload) {
    this.el.classList.toggle('-detailed', linksPayload.detailedView);

    if (linksPayload.detailedView === false) {
      this.svg.style('height', '100%');
    }

    this.layout.setViewportSize(linksPayload.sankeySize);
    this.layout.setLinksPayload(linksPayload);

    const relayout = this.layout.relayout();

    if (linksPayload.detailedView === true) {
      this.svg.style('height', this.layout.getMaxHeight() + 'px');
    }

    if (relayout === false) {
      return;
    }

    this._render(linksPayload.selectedRecolorBy, linksPayload.currentQuant);

    this.selectNodes(linksPayload);
  }

  selectNodes({ selectedNodesIds, shouldRepositionExpandButton }) {
    // let minimumY = Infinity;
    if (!this.layout.isReady()) {
      return;
    }

    this.sankeyColumns.selectAll('.sankey-node')
      .classed('-selected', node => {
        const isSelected = selectedNodesIds.indexOf(node.id) > -1;
        // if (isSelected) {
        //   if (node.y < minimumY) {
        //     minimumY = node.y;
        //   }
        // }
        return isSelected;
      });

    if (shouldRepositionExpandButton) this._repositionExpandButton(selectedNodesIds);

  }

  toggleExpandButton(areNodesExpanded) {
    this.expandButton.classList.toggle('-expanded', areNodesExpanded);
  }

  highlightNodes(nodesIds) {
    this.sankeyColumns.selectAll('.sankey-node')
      .classed('-highlighted', node => {
        return nodesIds.indexOf(node.id) > -1;
      });
  }

  _build() {
    this.layout = sankeyLayout()
      .columnWidth(100);

    this.el = document.querySelector('.js-sankey');
    this.svg = d3_select('.js-sankey-canvas');
    this.sankeyColumns = this.svg.selectAll('.sankey-column');
    this.linksContainer = this.svg.select('.sankey-links');

    this.linkTooltip = document.querySelector('.js-tool-tooltip');
    this.linkTooltipHideDebounced = _.debounce(this._onLinkOut, 10);

    this.sankeyColumns.on('mouseleave', () => { this._onColumnOut(); } );

    addSVGDropShadowDef(this.svg);

    this.expandButton = document.querySelector('.js-expand');
    this.expandActionButton = document.querySelector('.js-expand-action');
    this.expandActionButton.addEventListener('click', this._onExpandClick.bind(this));
    this.clearButton = document.querySelector('.js-clear');
    this.clearButton.addEventListener('click', this.callbacks.onClearClick);
  }

  _onExpandClick() {
    this.callbacks.onExpandClick();
  }

  _repositionExpandButton(nodesIds) {
    // TODO split by columns
    if (nodesIds && nodesIds.length > 0) {
      this.expandButton.classList.add('-visible');

      const lastSelectedNode = this.sankeyColumns.selectAll('.sankey-node')
        .filter(node => node.id === nodesIds[0])
        .data()[0];

      if (lastSelectedNode) {
        const selectedColumnFirstNode = this.sankeyColumns.selectAll('.sankey-node.-selected')
          .filter(node => node.x === lastSelectedNode.x)
          .data()
          .reduce((acc, val) => acc.y < val.y ? acc : val);

        const y = Math.max(0, selectedColumnFirstNode.y - 12);
        this.expandButton.style.top = `${y}px`;
        this.expandButton.style.left = `${selectedColumnFirstNode.x - 12}px`;
        return;
      }
    }
    this.expandButton.classList.remove('-visible');
  }

  _getLinkColor(link, selectedRecolorBy) {
    let classPath = 'sankey-link';
    if (!selectedRecolorBy) {
      return classPath;
    }

    if (selectedRecolorBy.name !== 'none') {
      if (link.recolorBy === null) {
        return classPath;
      }
      let recolorBy = link.recolorBy;
      if (selectedRecolorBy.divisor) {
        recolorBy = Math.round(link.recolorBy / selectedRecolorBy.divisor);
      }

      classPath = `${classPath} -recolorby-${_.toLower(selectedRecolorBy.legendType)}-${_.toLower(selectedRecolorBy.legendColorTheme)}-${recolorBy}`;
    } else {
      classPath = `${classPath} -recolorgroup-${link.recolorGroup}`;
    }

    return classPath;
  }

  _render(selectedRecolorBy, currentQuant) {
    this.sankeyColumns
      .data(this.layout.columns());

    this.sankeyColumns.attr('transform', d => `translate(${d.x},0)`);

    this.nodes = this.sankeyColumns.select('.sankey-nodes')
      .selectAll('g.sankey-node')
      .data(column => column.values, node => node.id);

    const that = this;
    const nodesEnter = this.nodes.enter()
      .append('g')
      .attr('class', 'sankey-node')
      .attr('transform', node => `translate(0,${node.y})`)
      .classed('-is-aggregated', node => node.isAggregated)
      .classed('-is-domestic', node => node.isDomesticConsumption)
      .classed('-is-alone-in-column', node => node.isAloneInColumn)
      .on('mouseenter', function(node) { that._onNodeOver(d3_select(this), node.id, node.isAggregated); } )
      .on('mouseleave', () => { this._onNodeOut(); } )
      .on('click', node => { this.callbacks.onNodeClicked(node.id, node.isAggregated); } );

    nodesEnter.append('rect')
      .attr('class', 'sankey-node-rect')
      .attr('width', this.layout.columnWidth())
      .attr('height', d => d.renderedHeight);

    this._renderTitles(nodesEnter);

    this.nodes.selectAll('text').remove();
    this._renderTitles(this.nodes);

    this.nodes.classed('-is-alone-in-column', node => node.isAloneInColumn);

    const nodesUpdate = this.nodes.transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('transform', d => `translate(0,${d.y})`);

    nodesUpdate.select('.sankey-node-rect')
      .attr('height', d => d.renderedHeight);



    this.nodes.exit()
      .remove();


    const linksData = this.layout.links();
    const links = this.linksContainer
      .selectAll('path')
      .data(linksData , link => link.id);

    // update
    links.attr('class', (link) => {return this._getLinkColor(link, selectedRecolorBy); } ); // apply color from CSS class immediately
    links.transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('stroke-width', d => Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, d.renderedHeight))
      .attr('d', this.layout.link());

    this.currentSelectedRecolorBy = selectedRecolorBy;
    this.currentQuant = currentQuant;

    // enter
    links.enter()
      .append('path')
      .attr('class', (link) => {return this._getLinkColor(link, selectedRecolorBy); } )
      .attr('d', this.layout.link())
      .on('mouseover', function(link) { that._onLinkOver(link, this); })
      .on('mouseout', function() {
        that.linkTooltipHideDebounced();
        this.classList.remove('-hover');
      })
      .transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('stroke-width', d => Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, d.renderedHeight));

    // exit
    links.exit()
      .transition()
      .duration(SANKEY_TRANSITION_TIME)
      .attr('stroke-width', 0)
      .remove();

  }

  _renderTitles(selection) {
    selection.append('text')
      .attr('class', 'sankey-node-labels')
      .attr('transform', placeNodeText)
      .selectAll('tspan')
      .data(node => node.label)
      .enter()
      .append('tspan')
      .attr('class', 'sankey-node-label')
      .attr('x', this.layout.columnWidth()/2)
      .attr('dy', 12)
      .text(d => d);
  }

  _onNodeOver(selection, nodeId, isAggregated) {
    // selection.classed('-highlighted', true);
    this.callbacks.onNodeHighlighted(nodeId, isAggregated);
  }

  _onNodeOut() {
    this.sankeyColumns.selectAll('.sankey-node').classed('-highlighted', false);
  }

  _onLinkOver(link, linkEl) {
    this.linkTooltipHideDebounced.cancel();

    const templateValues = {
      title: `${link.sourceNodeName} > ${link.targetNodeName}`,
      values: [{
        title: this.currentQuant.name,
        unit: this.currentQuant.unit,
        value: formatValue(link.quant, this.currentQuant.name)
      }]
    };

    if (this.currentSelectedRecolorBy && this.currentSelectedRecolorBy.name !== 'none') {
      templateValues.values.push({
        title: this.currentSelectedRecolorBy.label,
        value: this._getLinkValue(link)
      });
    }

    this.linkTooltip.innerHTML = TooltipTemplate(templateValues);
    this.linkTooltip.classList.remove('is-hidden');
    this.linkTooltip.style.left = `${d3_event.pageX + 10}px`;
    this.linkTooltip.style.top = `${d3_event.pageY + 10}px`;
    linkEl.classList.add('-hover');
  }

  _getLinkValue(link) {
    if (link.recolorBy === null) {
      return 'unknown';
    } else if (this.currentSelectedRecolorBy.type !== 'ind') {
      return _.capitalize(link.recolorBy);
    }

    let intervalCount = this.currentSelectedRecolorBy.intervalCount + 1;
    if (this.currentSelectedRecolorBy.divisor) {
      intervalCount = this.currentSelectedRecolorBy.divisor * this.currentSelectedRecolorBy.intervalCount + 1;
    }
    if (this.currentSelectedRecolorBy.legendType !== 'percentual') {
      return `${link.recolorBy}/${intervalCount}`;
    }

    return `${Math.round(link.recolorBy)}%`;
  }


  _onLinkOut() {
    this.linkTooltip.classList.add('is-hidden');
  }

  _onColumnOut() {
    this._onNodeOut();
    this.callbacks.onNodeHighlighted();
  }
}

const placeNodeText = node => `translate(0,${ - 7 + node.renderedHeight/2 - ((node.label.length-1) * 7) })`;
