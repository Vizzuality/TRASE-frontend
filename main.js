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

const sankeyURL = Object.keys(params).reduce((prev, current) => {
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
let linksContainer;

const build = () => {
  sankey = d3.sankey()
    .nodes(data.sankey.include)
    .links(data.sankey.data)
    .layout();

  console.log(sankey.layers());

  const svg = d3.select('svg');
  const sankeyContainer = svg.append('g')
    .attr('class','sankey');

  // layers
  const layers = sankeyContainer
    .append('g')
    .attr('class','sankey-layers')
    .selectAll('g')
    .data(sankey.layers())
    .enter()
    // .filter(d => d.key !== 'undefined')
    .append('g')
    .attr('class','sankey-layer')
    .attr('transform', d => `translate(${d.x},0)`);

  layers.append('text')
      // .text(d => layerNames[d.key])
      .text(d => `${d.key} (${layerNames.indexOf(d.key)})`)
      .attr('y', 40);

  // nodes
  const nodes = layers.append('g')
    .attr('class','sankey-nodes ')
    .selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${d.y})`)
    .on('mouseover', d => {
      selectNode(parseInt(d.id))
    })

  nodes.append('text')
    .attr('class', 'sankey-node-label')
    .attr('x', 10)
    .attr('y', d => 4+d.dy/2)
    .text(d => d.attributes.nodeName.toLowerCase());

  nodes.append('rect')
    .attr('class', 'sankey-node-rect')
    .attr('width', sankey.layerWidth())
    .attr('height', d => d.dy);

  // links
  linksContainer = sankeyContainer
    .append('g')
    .attr('class','sankey-links');



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

  selectNode(2562);
};

const selectNode = nodeId => {
  console.log(nodeId);

  sankey.selectNode(nodeId);

  linksContainer
    .selectAll('path').remove()

  linksContainer
    .selectAll('path')
    .data(sankey.mergedLinks())
    .enter()
    .append('path')
    .attr('class','sankey-link')
    .attr('stroke-width', d => d.dy)
    .attr('d', sankey.link());

  d3.selectAll('.sankey-link')
    .classed('sankey-link--selected', d => {
      if (d.originalPath.indexOf(nodeId) > -1) {
        // console.log(d.originalPath, Math.round(d.value/1000))
      }
      return d.originalPath.indexOf(nodeId) > -1;
    });
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
