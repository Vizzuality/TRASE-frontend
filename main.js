/* global d3 */
/*eslint no-console: 0*/

const params = {
  country: 'brazil',
  raw: 'soy',
  year: '2012',
  nNodes: '50',
  excludeLayers: [1,5,6,7,9],//378
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

const sankeyURL = (window.location.href.match('localhost')) ? 'sample.json' : Object.keys(params).reduce((prev, current) => {
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
let nodes;
let highlightedNode;
let selectedNode;
let currentLayerOffsets;

const compactMode = location.search.match('compactMode');
const layerWidth = 130;
const layerSpacing = 180;

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
    .style('width', '1500px')
    .style('height', `${document.documentElement.clientHeight}px`);

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

  layers.append('text')
      // .text(d => layerNames[d.key])
      .text(d => `${d.key} (${window.layerNames.indexOf(d.key)})`)
      .attr('y', 40);

  // nodes
  nodes = layers.append('g')
    .attr('class','sankey-nodes')
    .selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${d.y})`)
    .on('mouseover', d => {
      showNodeLinks(d);
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
    .scale(400)
    .translate([550, 200]);

  const geoPath = d3.geoPath()
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

  mapsContainer.append('g')
    .attr('class', 'maps-states')
    .selectAll('path')
    .data(data.states.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'maps-state')
    .on('click', d => {
      console.log(d.properties.node_id);
    });

  mapsContainer.append('g')
    .attr('class', 'maps-municips')
    .selectAll('path')
    .data(data.municips.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'maps-municip');
};



let hoverLinksData;
// let clickedLinksData;

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
};

const removeLinks = linksContainer => {
  linksContainer
    .selectAll('path').remove();
};


const removeHoverLinks = () => {
  removeLinks(hoverLinksContainer);
};

const showNodeLinks = node => {
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

  removeHoverLinks();

  currentLayerOffsets[selectedNode.shownLayerIndex] = 0;
  offsetLayer(selectedNode.shownLayerIndex, true);

  sankey.reorderNodes(highlightedNode.id, hoverLinksData, currentLayerOffsets);

  nodes
    .transition()
    .duration(500)
    .attr('transform', d => `translate(0,${d.y})`);

  redrawLinks(clickedLinksContainer, hoverLinksData); // TODO transition

};

const offset = (l, li) => {
  const e = d3.event;
  currentLayerOffsets[li] -= e.deltaY/10;
  offsetLayer(li);
  sankey.setLayersOffsets(hoverLinksData, currentLayerOffsets);

  redrawLinks(hoverLinksContainer, hoverLinksData);
};

const offsetLayer = (li, animate) => {
  let layer = layers.filter((d,i) => i === li)
    .select('.sankey-nodes');

  if (animate) {
    layer = layer.transition().duration(800);
  }
  layer.attr('transform',  `translate(0, ${currentLayerOffsets[li]})`);
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
