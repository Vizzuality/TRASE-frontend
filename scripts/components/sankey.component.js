import { select as d3_select, event as d3_event } from 'd3-selection';
import { zoomIdentity as d3_zoomIdentity, zoom as d3_zoom } from 'd3-zoom';
import 'styles/components/sankey.scss';
import 'styles/components/sankey/node.scss';
import { LAYER_NAMES } from 'constants';
import sankeyLayout from './sankey.d3layout.js';

const params = {
  // minimum height of a node, will be applied for small values
  minNodeHeight: 15,
  // scale factor for nodes scaling
  // FIXME ideally this should use a max height instead
  scaleY: .00005,
  layerWidth: 130,
  layerSpacing: 160,
  // slippy mode = 'pan and zoom' behaviour, instead of indicidual layer vertical scrolling
  slippyMode: true
};

export default class {
  dataUpdated(payload) {
    this._destroy();
    this._build(payload);
  }

  windowResized(size) {
    this.viewportHeight = size.height;
  }

  highlightNode(id) {
    // if id is null, user moused out of all nodes, justt remove highlighted links
    if (!id) {
      if (this.highlightedLinksContainer) this._removeLinks(this.highlightedLinksContainer);
      return;
    }

    // otherwise generate new links starting from this node
    //                                                            FIXME this is seriously wrong: we shoukdn't have to send the offsets all the time
    this.highlightedLinksData = this.layout.getLinksForNodeId(id, this.currentLayerOffsets);
    this._drawLinks(this.highlightedLinksContainer, this.highlightedLinksData);
  }

  selectNode(id) {
    this.clickedLinksData = this.layout.getLinksForNodeId(id, this.currentLayerOffsets);
    this._removeHighlightedLinks();

    // do we reset all layers, or only the one that owns the clicked node?
    // slippy
    if (params.slippyMode) {
      this.svg.transition().duration(750).call(this.zoom.transform, d3_zoomIdentity);
    } else {
      this.currentLayerOffsets = this.currentLayerOffsets.map(() => 0);
      this._offsetLayer(null, true);
    }

    this.layout.reorderNodes(id, this.clickedLinksData, this.currentLayerOffsets);

    this.nodes
      .transition()
      .duration(500)
      .attr('transform', d => `translate(0,${d.y})`);

    this._drawLinks(this.clickedLinksContainer, this.clickedLinksData);

  }


  _destroy() {
    if (this.zoom) this.zoom.on('zoom', null);
  }

  _build(payload) {

    this.layout = sankeyLayout(payload)
      .minNodeHeight(params.minNodeHeight)
      .scaleY(params.scaleY)
      .layerWidth(params.layerWidth)
      .layerSpacing(params.layerSpacing)
      .maxLabelCharsWidth(params.layerWidth)
      // max text lines per node
      .maxLabelLines(1)
      .layout();

    // reset currentLayerOffsets (used in individual vertical layers scrolling) to an array of 0s
    this.currentLayerOffsets = this.layout.layers().map(() => 0);

    this.svg = d3_select('#sankey');
    this.sankeyContainer = this.svg.select('.sankey-container');

    // build layers (vertical bars containing nodes)
    this.layers = this.sankeyContainer.select('.sankey-layers')
      .selectAll('g')
      .data(this.layout.layers())
      .enter()
      .append('g')
      .attr('class','sankey-layer')
      .attr('transform', d => `translate(${d.x},0)`)
      .on('mousewheel', (params.slippyMode) ? ()=>{} : this._onMouseWheel)
      .on('mouseout', this.callbacks.onNodeHighlighted(null));

    // build node containers inside layers
    this.nodes = this.layers.append('g')
      .attr('class','sankey-nodes')
      .selectAll('rect')
      .data(d => d.values)
      .enter()
      .append('g')
      .attr('class', 'sankey-node')
      .attr('transform', d => `translate(0,${d.y})`)
      .on('mouseover', d => { this.callbacks.onNodeHighlighted(d.id); } )
      .on('click', () => { this.callbacks.onNodeSelected(); } );

    // build nodes rects
    this.nodes.append('rect')
      .attr('class', 'sankey-node-rect')
      .attr('width', this.layout.layerWidth())
      .attr('height', d => d.dy);

    // build nodes labels
    // actually a group of text elements: this is because SVG <text> does not support multiline text
    this.nodes.append('g')
      .attr('class', 'sankey-node-labels')
      .attr('transform', d => `translate(0,${d.dy/2})`)
      .selectAll('text')
      .data(d => d.nodeNameLinesShown)
      .enter()
      .append('text')
      .attr('class', 'sankey-node-label')
      .attr('x', this.layout.layerWidth()/2)
      .attr('y', (d, i) => 4+i * 12)
      .text(d => d);

    this.layers.append('text')
      .text(d => `${d.key} (${LAYER_NAMES.indexOf(d.key)})`)
      .attr('y', 40);

    // svg groups that will contain highlighted links (on mouse over), and clicked links
    this.clickedLinksContainer = this.sankeyContainer.select('.sankey-clicked-links');
    this.highlightedLinksContainer = this.sankeyContainer.select('.sankey-highlighted-links');

    // init pan/zoom behaviour
    if (params.slippyMode) {
      this.zoom = d3_zoom()
        .scaleExtent([.6, 1])
        .on('zoom', () => {
          const t = d3_event.transform;
          const transform = `translate(0,${Math.min(0,t.y)}) scale(${t.k},${t.k})`;
          this.sankeyContainer.attr('transform', transform);
        });
      this.svg.call(this.zoom);
    }
  }

  // draw all links on a linksContainer (either highlight or click)
  _drawLinks(linksContainer, linksData) {
    this._removeLinks(linksContainer);

    linksContainer
      .selectAll('path')
      .data(linksData)
      .enter()
      .append('path')
      .attr('class','sankey-link')
      .attr('stroke-width', d => Math.max(d.dy, .5))
      .attr('d', this.layout.link());

      // code used in the prototype to draw map <> sankey links
      // FIXME this might need to move somewhere else?
      // statesLinksContainer
      //   .selectAll('path').remove();
      // var stateNodes = sankey.layers()[0].values
      //   .filter(node => node.id === highlightedNode.id);
      // statesLinksContainer
      //   .selectAll('path')
      //   .data(stateNodes)
      //   // .filter(node => { debugger; node.id === highlightedNode.id})
      //   .enter()
      //   .append('path')
      //   // .append('circle')
      //   .attr('class','sankey-link')
      //   .attr('stroke-width', d => d.dy/10)
      //   .each(node => {
      //     const state = data.states.features.find(feature => {
      //       return parseInt(feature.properties.node_id)  === node.id;
      //     });
      //
      //     if (state) {
      //       node.x = geoPath.centroid(state)[0];
      //       node.sy = geoPath.centroid(state)[1];
      //       node.dx = 350 - node.x;
      //       node.ty = node.y + 15 + currentLayerOffsets[0];
      //     }
      //   })
      //   .attr('id', node => node.attributes.nodeName)
      //   .attr('cx', node => node.x)
      //   .attr('cy', node => node.sy)
      //   .attr('r', 10)
      //   .attr('d', sankey.mapLink());
  }

  // get rid of all paths objects in a links container
  _removeLinks(linksContainer) {
    linksContainer
      .selectAll('path').remove();
  }

  _removeHighlightedLinks() {
    this._removeLinks(this.highlightedLinksContainer);
  }

  // per layer vertical scroll handler
  _onMouseWheel(layer, layerIndex) {
    const e = d3_event;
    const currentLayerOffset = this.currentLayerOffsets[layerIndex];
    // FIXME have a scrollSpeed param
    const delta =  - e.deltaY/5;
    // compute by how much the layer overflows the viewport, used in max scroll value
    const layerOverflow = -(layer.dy - this.viewportHeight);
    this.currentLayerOffsets[layerIndex] = Math.min(0, Math.max(layerOverflow, currentLayerOffset + delta));
    this._offsetLayer(layerIndex);

    // FIXME !!!
    // this.layout.setLayersOffsets(hoverLinksData, currentLayerOffsets);
    // redrawLinks(highlightedLinksContainer, hoverLinksData);
    //
    // if (clickedLinksData) {
    //   sankey.setLayersOffsets(clickedLinksData, currentLayerOffsets);
    //   redrawLinks(clickedLinksContainer, clickedLinksData);
    // }
  }

  // offsets one or all layers vertically
  // layerIndex: if set to null, all layers will be selected
  _offsetLayer(layerIndex, animate) {
    let layer = (layerIndex !== null) ? this.layers.filter((d,i) => i === layerIndex) : this.layers;
    layer = layer.select('.sankey-nodes');

    if (animate) {
      layer = layer.transition().duration(800);
    }
    layer.attr('transform',  `translate(0, ${this.currentLayerOffsets[layerIndex]})`);
  }
}
