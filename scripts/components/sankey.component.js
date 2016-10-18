import { select as d3_select /*, selectAll as d3_selectAll*/ } from 'd3-selection';
import  'd3-transition';
import sankeyLayout from './sankey.d3layout.js';
import getComputedSize from 'utils/getComputedSize';
import 'styles/components/sankey.scss';

export default class {

  onCreated() {
    this._build();
  }
  windowResized() {
    // console.log(size);

    this.layout.setViewportSize(getComputedSize('.js-sankey-canvas'));

    if (this.layout.relayout()) {
      this._render();
    }
  }

  initialDataLoadStarted(loading) {
    this._toggleLoading(loading);
  }

  linksLoadStarted(loading) {
    this._toggleLoading(loading);
  }

  linksLoaded(linksPayload) {
    // console.log(linksPayload)
    this.layout.setLinksPayload(linksPayload);
    if (this.layout.relayout()) {
      this._render();
    }
  }

  selectNodes(nodesIds) {
    this.sankeyColumns.selectAll('.sankey-node')
      .classed('-selected', node => {
        return nodesIds.indexOf(node.id) > -1;
      });
  }

  highlightNode() {
    // console.log('highlight', nodeId);
  }


  _build() {
    this.layout = sankeyLayout()
      .columnWidth(100);

    this.el = document.querySelector('.js-sankey');
    this.svg = d3_select('.js-sankey-canvas');
    this.sankeyColumns = this.svg.selectAll('.sankey-column');
    this.linksContainer = this.svg.select('.sankey-links');

    this.sankeyColumns.on('mouseleave', () => { this.callbacks.onNodeHighlighted(null); } );
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

    const nodesEnter = this.nodes.enter()
      .append('g')
      .attr('class', 'sankey-node')
      .attr('transform', node => `translate(0,${node.y})`)
      .classed('-is-aggregated', node => node.isAggregated)
      .on('mouseenter', node => { this.callbacks.onNodeHighlighted(node.id); } )
      .on('click', node => { this.callbacks.onNodeClicked(node.id, node.isAggregated); } );

    nodesEnter.append('rect')
      .attr('class', 'sankey-node-rect')
      .attr('width', this.layout.columnWidth())
      .attr('height', d => d.renderedHeight);

    nodesEnter.append('g')
      .attr('class', 'sankey-node-labels')
      .attr('transform', d => `translate(0,${2 + d.renderedHeight/2})`)
      .selectAll('text')
      .data(node => { return this.layout.getNodeLabel(node.name, node.renderedHeight);})
      .enter()
      .append('text')
      .attr('class', 'sankey-node-label')
      .attr('x', this.layout.columnWidth()/2)
      .attr('y', (d, i) => 2 + i * 12)
      .text(d => d);


    const nodesUpdate = this.nodes.transition()
      .attr('transform', d => `translate(0,${d.y})`);

    nodesUpdate.select('.sankey-node-rect')
      .attr('height', d => d.renderedHeight);

    const nodesExit = this.nodes.exit()
      .transition()
      .attr('transform', d => `translate(-100,${d.y})`)
      .remove();

    console.log('update', nodesUpdate.size());
    console.log('enter', nodesEnter.size());
    console.log('exit', nodesExit.size());


    this.linksContainer.selectAll('path').remove();
    this.linksContainer
      .selectAll('path')
      .data(this.layout.links())
      .enter()
      .append('path')
      .attr('class', 'sankey-link')
      .attr('stroke-width', d => d.renderedHeight)
      .attr('d', this.layout.link())
      .on('mouseover', function() {
        this.classList.add('-hover');
      })
      .on('mouseout', function() {
        this.classList.remove('-hover');
      });
  }

}
