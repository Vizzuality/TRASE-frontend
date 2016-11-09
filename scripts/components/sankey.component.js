import { select as d3_select /*, selectAll as d3_selectAll*/ } from 'd3-selection';
import  'd3-transition';
import { DETAILED_VIEW_MIN_LINK_HEIGHT } from 'constants';
import addSVGDropShadowDef from 'utils/addSVGDropShadowDef';
import sankeyLayout from './sankey.d3layout.js';
import getComputedSize from 'utils/getComputedSize';
import 'styles/components/sankey.scss';

export default class {

  onCreated() {
    this._build();
  }

  resizeViewport({selectedNodesIds, shouldRepositionExpandButton}) {
    this.layout.setViewportSize(getComputedSize('.js-sankey-canvas'));

    if (this.layout.relayout()) {
      this._render();
      if (shouldRepositionExpandButton) this._repositionExpandButton(selectedNodesIds);
    }
  }

  initialDataLoadStarted(loading) {
    this._toggleLoading(loading);
  }

  linksLoadStarted(loading) {
    this._toggleLoading(loading);
  }

  linksLoaded(linksPayload) {
    this.el.classList.toggle('-detailed', linksPayload.detailedView);

    if (linksPayload.detailedView === false) {
      this.svg.style('height', '100%');
    }
    this.layout.setViewportSize(getComputedSize('.js-sankey-canvas'));
    this.layout.setLinksPayload(linksPayload);
    this.layout.relayout();

    if (linksPayload.detailedView === true) {
      this.svg.style('height', this.layout.getMaxHeight() + 'px');
    }

    // hide expoand button in detailed mapMethodsToState
    this.expandButton.classList.toggle('-visible', !linksPayload.detailedView);

    this._render();

  }

  selectNodes({selectedNodesIds, shouldRepositionExpandButton}) {
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

    this.sankeyColumns.on('mouseleave', () => { this._onColumnOut(); } );

    addSVGDropShadowDef(this.svg);

    this.expandButton = document.querySelector('.js-expand');
    this.expandButton.addEventListener('click', this._onExpandClick.bind(this));

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
        let y = Math.max(0, lastSelectedNode.y - 12);
        this.expandButton.style.top = `${y}px`;
        this.expandButton.style.left = `${lastSelectedNode.x - 12}px`;
        return;
      }
    }
    this.expandButton.classList.remove('-visible');
  }

  _toggleLoading(loading) {
    this.el.querySelector('.js-loading').classList.toggle('-visible', loading);
  }

  _render() {
    this.sankeyColumns
      .data(this.layout.columns());

    this.sankeyColumns.attr('transform', d => `translate(${d.x},0)`);

    this.nodes = this.sankeyColumns.select('.sankey-nodes')
      .selectAll('g.sankey-node')
      .data(column => column.values, node => node.id);

    let that = this;
    const nodesEnter = this.nodes.enter()
      .append('g')
      .attr('class', 'sankey-node')
      .attr('transform', node => `translate(0,${node.y})`)
      .classed('-is-aggregated', node => node.isAggregated)
      .on('mouseenter', function(node) { that._onNodeOver(d3_select(this), node.id, node.isAggregated); } )
      .on('mouseleave', () => { this._onNodeOut(); } )
      .on('click', node => { this.callbacks.onNodeClicked(node.id, node.isAggregated); } );

    nodesEnter.append('rect')
      .attr('class', 'sankey-node-rect')
      .attr('width', this.layout.columnWidth())
      .attr('height', d => d.renderedHeight);

    nodesEnter.append('text')
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


    const nodesUpdate = this.nodes.transition()
      .attr('transform', d => `translate(0,${d.y})`);

    nodesUpdate.select('.sankey-node-rect')
      .attr('height', d => d.renderedHeight);

    nodesUpdate.select('.sankey-node-labels')
    .attr('transform', placeNodeText);

    this.nodes.exit()
      .remove();


    const linksData = this.layout.links();

    const links = this.linksContainer
      .selectAll('path')
      .data(linksData , link => link.id);

    // update
    links.transition()
      .attr('stroke-width', d => Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, d.renderedHeight))
      .attr('d', this.layout.link());

    // enter
    links.enter()
      .append('path')
      .attr('class', link => `sankey-link -qual-${link.qual}`)
      .attr('d', this.layout.link())
      .on('mouseover', function() {
        this.classList.add('-hover');
      })
      .on('mouseout', function() {
        this.classList.remove('-hover');
      })
      .transition()
      .attr('stroke-width', d => Math.max(DETAILED_VIEW_MIN_LINK_HEIGHT, d.renderedHeight));

    // exit
    links.exit()
      .transition()
      .attr('stroke-width', 0)
      .remove();

  }

  _onNodeOver(selection, nodeId, isAggregated) {
    // selection.classed('-highlighted', true);
    this.callbacks.onNodeHighlighted(nodeId, isAggregated);
  }

  _onNodeOut() {
    this.sankeyColumns.selectAll('.sankey-node').classed('-highlighted', false);
  }

  _onColumnOut() {
    this._onNodeOut();
    this.callbacks.onNodeHighlighted();
  }
}

const placeNodeText = node => `translate(0,${ - 7 + node.renderedHeight/2 - ((node.label.length-1) * 7) })`;
