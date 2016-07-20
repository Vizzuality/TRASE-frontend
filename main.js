/* global d3 */
/*eslint no-console: 0*/

const params = {
  country: 'brazil',
  raw: 'soy',
  year: '2012',
  nNodes: '1',
  excludeLayers: [2,3,4,5,6,7,8,9],
  flowQuant: 'Volume',
  flowQual: 'Commodity'
};

const layerNames = [
  'Municipality of production',
  'State of production',
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
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



let sankeyLinks, sankeyNodes, municip;

const build = () => {
  // console.log(window.municip);
  // console
  var layers = d3.nest()
    .key(el => el.attributes.nodeType)
    .entries(sankeyNodes);

  console.log(layers);

  const bars = d3.select('svg')
    .append('g')
    .selectAll('g')
    .data(layers)
    .enter()
    // .filter(d => d.key !== 'undefined')
    .append('g')
    .attr('class','layer')
    .attr('transform', (d,i) => `translate(${i*250},0)`);

  bars.append('text')
    // .text(d => layerNames[d.key])
    .text(d => d.key)
    .attr('y', 40);

  const barItems = bars.append('g')
    .selectAll('rect')
    .data(d => d.values)
    .enter()
    .append('g')
    .attr('transform', (d,i) => `translate(0,${40+i*20})`)

  barItems.append('text')
    .text(d => d.attributes.value)
    .attr('y', 40);

};

const getNodeById = (nodes, id) => {
  return nodes.find(node => id === node.id);
};

const weighNodes = (nodes, links) => {
  links.forEach(link => {
    const value = +link.attributes.flowQuants[0].quantValue;
    console.log(value);
    link.attributes.path.forEach(nodeId => {
      const node = getNodeById(nodes, ''+nodeId);
      node.value = (node.value) ? node.value + value : value;
    });
  });
  return nodes;
};

d3.json(sankeyURL, sankey => {
  sankeyLinks = sankey.data;
  console.log(sankeyLinks)
  sankeyLinks.forEach(l => {
    console.log(l.attributes.path)
  })
  sankeyNodes = weighNodes(sankey.include, sankeyLinks);
  // sankeyNodes = sankey.include;
  console.log(sankeyNodes)

  d3.csv('https://p2cs-sei.carto.com/api/v2/sql?format=csv&q=SELECT * FROM brazil_municip_nodes', m => {
    municip = m;

    build();
  });
});
