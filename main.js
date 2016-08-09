/* global d3 */
/*eslint no-console: 0*/

const params = {
  country: 'brazil',
  raw: 'soy',
  year: '2012',
  nNodes: '50',
  excludeLayers: [2,3,4,5,6,7,9],
  flowQuant: 'Volume',
  flowQual: 'Commodity'
};

const layerNames = [
  'Municipality of production',
  'State of production',
  // ,
  // ,
  // ,
  // ,
  // ,
  // ,
  // ,
  // ,
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


const build = () => {
  const sankey = d3.sankey()
    .nodes(data.sankey.include)
    .links(data.sankey.data)
    .layout();

  console.log(sankey.layers());
  // let s = ''
  // sankey.layers().forEach(l => {
  //   s += '\n\n' + l.key;
  //   l.values.forEach(n => {
  //     s += '\n' + n.attributes.nodeName +',';
  //
  //   })
  // })
// console.log(s)

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
      .text(d => d.key)
      .attr('y', 40);

  // nodes
  const nodes = layers.append('g')
    .attr('class','sankey-nodes ')
    .selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${d.y})`);

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
  sankeyContainer
    .append('g')
    .attr('class','sankey-links')
    .selectAll('path')
    .data(sankey.links())
    .enter()
    .append('path')
    .attr('class','sankey-link')
    .attr('stroke-width', d => d.dy)
    .attr('d', sankey.link());


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
    .attr('class', 'maps-country')
    .attr('clip-path', 'url(#map-country-mask)')
    .selectAll('path')
    .data(data.world.features)
    .enter()
    .filter(d => {
      // for perf do not draw far way countries
      return d3.geoDistance(d3.geoCentroid(d), [-60, 10]) < 1;
    })
    .each(d => {console.log(d);})
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'maps-country-border');

  mapsContainer.append('g')
    .selectAll('path')
    .data(data.brazil_states.features)
    .enter()
    .append('path')
    .attr('d', geoPath)
    .attr('class', 'maps-country-state')
    .on('click', d => {
      console.log(d.properties.node_id);
    });
};


const URLs = [
  sankeyURL,
  'https://p2cs-sei.carto.com/api/v2/sql?format=geojson&q=SELECT ST_Simplify(the_geom, .1) the_geom, name, node_id, lat, lng FROM brazil_states_nodes',
  'https://p2cs-sei.carto.com/api/v2/sql?format=geojson&q=SELECT the_geom FROM world_borders' //WHERE ST_DWithin(the_geom, ST_GeomFromText(\'POINT(-60 10)\', 4326), 41)
];

const URLsPromises = URLs.map(u => fetch(u));

Promise.all(URLsPromises)
  .then(responses => Promise.all(responses.map(res => res.text())))
  .then(loadedData => {
    data.sankey = JSON.parse(loadedData[0]);
    data.brazil_states = JSON.parse(loadedData[1]);
    data.world = JSON.parse(loadedData[2]);
    console.log(data);
    build();
  });
