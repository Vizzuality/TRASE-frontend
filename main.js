/* global d3 */
/*eslint no-console: 0*/

const params = {
  country: 'brazil',
  raw: 'soy',
  year: '2012',
  nNodes: '50',
  excludeLayers: [],
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
  'Country of import',
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



let sankeyLinks, sankeyNodes/*, municip*/;



// const getNodeById = (nodes, id) => {
//   return nodes.find(node => id === node.id);
// };

// const weighNodes = (nodes, links) => {
//   links.forEach(link => {
//     const value = +link.attributes.flowQuants[0].quantValue;
//     console.log(value);
//     link.attributes.path.forEach(nodeId => {
//       const node = getNodeById(nodes, ''+nodeId);
//       node.value = (node.value) ? node.value + value : value;
//     });
//   });
//   return nodes;
// };

const build = () => {
  const sankey = d3.sankey()
    .nodes(sankeyNodes)
    .links(sankeyLinks)
    .layout();

  console.log(sankey.layers());
  let s = ''
  sankey.layers().forEach(l => {
    s += '\n\n' + l.key;
    l.values.forEach(n => {
      s += '\n' + n.attributes.nodeName +',';

    })
  })
console.log(s)
  const layers = d3.select('svg')
    .append('g')
    .attr('class','layers')
    .selectAll('g')
    .data(sankey.layers())
    .enter()
    // .filter(d => d.key !== 'undefined')
    .append('g')
    .attr('class','layer')
    .attr('transform', d => `translate(${d.x},0)`);

  layers.append('text')
      // .text(d => layerNames[d.key])
      .text(d => d.key)
      .attr('y', 40);

  const nodes = layers.append('g')
    .selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('g')
    .attr('transform', d => `translate(0,${d.y})`);

  nodes.append('text')
    .attr('class', 'node-label')
    .attr('x', 10)
    .attr('y', d => 4+d.dy/2)
    .text(d => d.attributes.nodeName.toLowerCase());

  nodes.append('rect')
    .attr('class', 'node-rect')
    .attr('width', sankey.layerWidth())
    .attr('height', d => d.dy);

  const links = d3.select('svg')
    .append('g')
    .attr('class','links')
    .selectAll('path')
    .data(sankey.links())
    .enter()
    .append('path')
    .attr('class','link')
    .attr('stroke-width', d => d.dy)
    .attr('d', sankey.link());
};


const URLs = [
  sankeyURL,
  'https://p2cs-sei.carto.com/api/v2/sql?format=csv&q=SELECT * FROM brazil_municip_nodes'
  // 'https://p2cs-sei.carto.com/api/v2/sql?format=shp&q=SELECT * FROM world_borders'
];

const URLsPromises = URLs.map(fetch);
console.log(URLsPromises);

Promise.all(URLsPromises)
  .then(responses => Promise.all(responses.map(res => res.text())))
  .then(data => {
    console.log(data)
  });

Promise.all([
  fetch(sankeyURL),
  fetch('https://p2cs-sei.carto.com/api/v2/sql?format=shp&q=SELECT * FROM world_borders')
]).then(responses => {
  return responses.map(response => response.text())
}).then(data => {
  console.log(data[0].PromiseValue)
})
//
// d3.json(sankeyURL, sankey => {
//   sankeyLinks = sankey.data;
//   // console.log(sankeyLinks);
//   sankeyNodes = sankey.include;
//   // console.log(sankeyLinks)
//   // sankeyNodes = weighNodes(sankey.include, sankeyLinks);
//   // console.log(sankeyNodes)
//
//   d3.csv('https://p2cs-sei.carto.com/api/v2/sql?format=csv&q=SELECT * FROM brazil_municip_nodes', m => {
//     // municip = m;
//
//     build();
//   });
// });
