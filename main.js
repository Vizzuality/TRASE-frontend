/* global d3 */
/*eslint no-console: 0*/

const params = {
  country: 'brazil',
  raw: 'soy',
  year: '2012',
  nNodes: '50',
  excludeLayers: [0,5,6,7,9],//378
  excludeNodes: [2575,2576,2577,2578],//378
  flowQuant: 'Volume',
  flowQual: 'Commodity',
  includeNodeQuals: ['Mun Id IBGE'],
  clickedNodes: [39]
};

window.layerNames = [
  'Municipality of production',
  'State of production',
  'Port of export',
  'Trader',
  'Exporter',
  'Carrier',
  'Vessel',
  'Via port',
  'Importer',
  'Port of import',
  'Country of import'
];

const sankeyURL = (!window.location.href.match('localhost')) ? 'sample.json' : Object.keys(params).reduce((prev, current) => {
  const value = params[current];
  if (Array.isArray(value)) {
    const arrUrl = value.reduce((arrPrev, arrCurrent) => {
      return `${arrPrev}&${current}=${arrCurrent}`;
    },'');
    return `${prev}&${arrUrl}`;
  }
  return `${prev}&${current}=${params[current]}`;
}, 'http://localhost:8080?');


let data = {};
let sankey;
let layers;
let clickedLinksContainer;
let hoverLinksContainer;
let statesLinksContainer;
let nodes;
let highlightedNode;
let selectedNode;
let currentLayerOffsets;
let geoPath;

const viewportHeight = document.documentElement.clientHeight - 10;
const compactMode = location.search.match('compactMode');
const layerWidth = 130;
const layerSpacing = 160;

const build = () => {
  sankey = d3.sankey()
    .minNodeHeight(compactMode ? 15 : 30)
    .scaleY(compactMode ? .00007 : .00004)
    .layerWidth(layerWidth)
    .layerSpacing(layerSpacing)
    .maxLabelCharsWidth(layerWidth)
    .maxLabelLines(compactMode ? 1 : 2)
    .nodes(data.sankey.include)
    .links(data.sankey.data)
    .layout();

  console.log(sankey.layers());

  const svg = d3.select('svg')
    .style('width', '2500px')
    .style('height', `${viewportHeight}px`);

  const sankeyContainer = svg.append('g')
    .attr('class','sankey');

  // layers
  layers = sankeyContainer
    .append('g')
    .attr('class','sankey-layers')
    .selectAll('g')
    .data(sankey.layers())
    .enter()
    // .filter(d => d.key !== 'undefined')
    .append('g')
    .attr('class','sankey-layer')
    .attr('transform', d => `translate(${d.x},0)`)
    .on('mousewheel', offset)
    .on('mouseout', removeHoverLinks);

  currentLayerOffsets = sankey.layers().map(() => 0);

  // nodes
  nodes = layers.append('g')
    .attr('class','sankey-nodes')
    .selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${d.y})`)
    .on('mouseover', d => {
      highlightNodeLinks(d);
    })
    .on('click', () => {
      selectCurrentNode();
    });

  nodes.append('rect')
    .attr('class', 'sankey-node-rect')
    .attr('width', sankey.layerWidth())
    .attr('height', d => d.dy);

  nodes.append('g')
    .attr('class', 'sankey-node-labels')
    .attr('transform', d => `translate(0,${d.dy/2})`)
    .selectAll('text')
    .data(d => d.nodeNameLinesShown)
    .enter()
    .append('text')
    .attr('class', 'sankey-node-label')
    .attr('x', layerWidth/2)
    .attr('y', (d, i) => {
      return 4+i * 12;
    })
    .text(d => d);


  layers.append('text')
      // .text(d => layerNames[d.key])
      .text(d => `${d.key} (${window.layerNames.indexOf(d.key)})`)
      .attr('y', 40);


  // links
  clickedLinksContainer = sankeyContainer
    .append('g')
    .attr('class','sankey-clicked-links');

  hoverLinksContainer = sankeyContainer
    .append('g')
    .attr('class','sankey-hover-links');



  // map
  const mapsContainer = svg.append('g')
    .attr('class','maps');

  mapsContainer.append('clipPath')
    .attr('id','map-country-mask')
    .append('rect')
    .attr('class', 'maps-country-mask-rect');


  const proj = d3.geoEquirectangular()
    .scale(600)
    .translate([680, 200]);

  geoPath = d3.geoPath()
    .projection(proj);

  mapsContainer.append('g')
    .attr('class', 'maps-countries')
    .attr('clip-path', 'url(#map-country-mask)')
    .selectAll('path')
    .data(data.countries.features)
    .enter()
    .filter(d => {
      // for perf do not draw far way countries
      return d3.geoDistance(d3.geoCentroid(d), [-60, 10]) < 1;
    })
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'maps-country');

  var states = mapsContainer.append('g')
    .attr('class', 'maps-states')
    .selectAll('g')
    .data(data.states.features)
    .enter()
    .append('g');

  states.append('path')
    .attr('d', geoPath)
    .attr('class', 'maps-state')
    .on('click', d => {
      console.log(d.properties.node_id);
    });

  states.append('circle')
    .attr('class', 'maps-state-circle')
    .attr('cx', d => {
      return geoPath.centroid(d)[0];
    })
    .attr('cy', d => {
      return geoPath.centroid(d)[1];
    })
    .attr('r', 5);

  statesLinksContainer = mapsContainer
      .append('g')
      .attr('class','sankey-state-links');


  // mapsContainer.append('g')
  //   .attr('class', 'maps-municips')
  //   .selectAll('path')
  //   .data(data.municips.features)
  //   .enter()
  //   .append('path')
  //   .attr('d', geoPath)
  //   .attr('class', 'maps-municip');
};



let hoverLinksData;
let clickedLinksData;

const redrawLinks = (linksContainer, linksData) => {
  removeLinks(linksContainer);

  linksContainer
    .selectAll('path')
    .data(linksData)
    .enter()
    .append('path')
    .attr('class','sankey-link')
    .attr('stroke-width', d => Math.max(d.dy, .5))
    .attr('d', sankey.link());


  statesLinksContainer
    .selectAll('path').remove();
  var stateNodes = sankey.layers()[0].values
    .filter(node => node.id === highlightedNode.id);
  statesLinksContainer
    .selectAll('path')
    .data(stateNodes)
    // .filter(node => { debugger; node.id === highlightedNode.id})
    .enter()
    .append('path')
    // .append('circle')
    .attr('class','sankey-link')
    .attr('stroke-width', d => d.dy/10)
    .each(node => {
      const state = data.states.features.find(feature => {
        return parseInt(feature.properties.node_id)  === node.id;
      });

      if (state) {
        node.x = geoPath.centroid(state)[0];
        node.sy = geoPath.centroid(state)[1];
        node.dx = 350 - node.x;
        node.ty = node.y + 15 + currentLayerOffsets[0];
      }
    })
    .attr('id', node => node.attributes.nodeName)
    .attr('cx', node => node.x)
    .attr('cy', node => node.sy)
    .attr('r', 10)
    .attr('d', sankey.mapLink());

};

const removeLinks = linksContainer => {
  linksContainer
    .selectAll('path').remove();
};


const removeHoverLinks = () => {
  removeLinks(hoverLinksContainer);
};

const highlightNodeLinks = node => {
  if (selectedNode && node.id === selectedNode.id) {
    removeHoverLinks();
    return;
  }
  highlightedNode = node;
  hoverLinksData = sankey.getLinksForNodeId(highlightedNode.id, currentLayerOffsets);
  redrawLinks(hoverLinksContainer, hoverLinksData);
};

const selectCurrentNode = () => {
  selectedNode = highlightedNode;
  clickedLinksData = hoverLinksData;

  removeHoverLinks();

  // do we reset all layers, or only the one that owns the clicked node?
  // currentLayerOffsets[selectedNode.shownLayerIndex] = 0;
  currentLayerOffsets = currentLayerOffsets.map(() => 0);
  // offsetLayer(selectedNode.shownLayerIndex, true);
  offsetLayer(null, true);

  sankey.reorderNodes(highlightedNode.id, clickedLinksData, currentLayerOffsets);


  nodes
    .transition()
    .duration(500)
    .attr('transform', d => `translate(0,${d.y})`);

  redrawLinks(clickedLinksContainer, clickedLinksData); // TODO transition

};

const offset = (l, li) => {
  const e = d3.event;
  const currentLayerOffset = currentLayerOffsets[li];
  const delta =  - e.deltaY/5;
  const layerOverflow = -(l.dy - viewportHeight);
  currentLayerOffsets[li] = Math.min(0, Math.max(layerOverflow, currentLayerOffset + delta));
  offsetLayer(li);

  sankey.setLayersOffsets(hoverLinksData, currentLayerOffsets);
  redrawLinks(hoverLinksContainer, hoverLinksData);

  if (clickedLinksData) {
    sankey.setLayersOffsets(clickedLinksData, currentLayerOffsets);
    redrawLinks(clickedLinksContainer, clickedLinksData);
  }
};

const offsetLayer = (layerIndex, animate) => {
  let layer = (layerIndex !== null) ? layers.filter((d,i) => i === layerIndex) : layers;
  layer = layer.select('.sankey-nodes');

  if (animate) {
    layer = layer.transition().duration(800);
  }
  layer.attr('transform',  `translate(0, ${currentLayerOffsets[layerIndex]})`);
};

const CartoURL = 'https://p2cs-sei.carto.com/api/v2/sql?format=geojson';
const URLs = [
  sankeyURL,
  `${CartoURL}&q=SELECT the_geom FROM world_borders`, // WHERE ST_DWithin(the_geom, ST_GeomFromText('POINT(-60 10)', 4326), 41)`
  `${CartoURL}&q=SELECT ST_Simplify(the_geom, .1) the_geom, name, node_id, lat, lng FROM brazil_states_nodes`,
  `${CartoURL}&q=SELECT ST_Simplify(the_geom, .1) the_geom FROM brazil_final_copy`
];

const URLsPromises = URLs.map(u => fetch(u));

Promise.all(URLsPromises)
  .then(responses => Promise.all(responses.map(res => res.text())))
  .then(loadedData => {
    data.sankey = JSON.parse(loadedData[0]);
    data.countries = JSON.parse(loadedData[1]);
    data.states = JSON.parse(loadedData[2]);
    data.municips = JSON.parse(loadedData[3]);
    console.log(data);
    build();
  });
