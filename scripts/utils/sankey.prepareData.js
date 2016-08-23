// this prepares the data received from the API for easy consumption by the sankey component
import { nest as d3_nest } from 'd3-collection';
import { sum as d3_sum } from 'd3-array';
import getNode from 'utils/sankey.getNode';
import { LAYER_NAMES } from 'constants';

export default payload => {
  let nodes = payload.include;

  // original data comes as full path links, meaning they go from first layer to last layer
  // this build simpler node-node link tuples (only between two layers)
  let links = breakDownLinks(payload.data, nodes);

  // group nodes by layers
  let layers = computeLayers(nodes);

  // attach original links to nodes
  ({ nodes, links } = computeNodeLinks(nodes, links));

  // values are originally only encoded in links object
  // compute cumulated values per node, using its links, which will be used later for computing node heights
  nodes = computeNodeValues(nodes);

  return {
    layers,
    nodes,
    links
  };
};

//break down links into simple src - target tuples
const breakDownLinks = (links, nodes) => {
  var linkTuples = [];
  links.forEach(link => {
    var path = link.attributes.path;
    for (var i = 0; i < path.length-1; i++) {
      linkTuples.push({
        // sourceNodeIndex: getNodeIndex(path[i]),
        // targetNodeIndex: getNodeIndex(path[i+1]),
        sourceNodeId: path[i],
        targetNodeId: path[i+1],
        sourceNode: getNode(nodes, path[i]),
        targetNode: getNode(nodes, path[i+1]),
        attributes: link.attributes,
        value: parseFloat(link.attributes.flowQuants[0].quantValue),
        originalPath: path
      });
    }
  });
  return linkTuples;
};

const computeLayers = (nodes) => {
  const layers = d3_nest()
  .key(el => {
    return el.attributes.nodeType;
  })
  .sortKeys((a, b) => {
    return (LAYER_NAMES.indexOf(a) < LAYER_NAMES.indexOf(b)) ? -1 : 1;
  })
  .entries(nodes);

  layers.forEach((layer, i) => {
    layer.values.forEach(node => {
      node.shownLayerIndex = i;
      node.id = parseInt(node.id);
    });
  });

  return layers;
};

const computeNodeLinks = (nodes, links) => {
  nodes.forEach(function(node) {
    node.sourceLinks = [];
    node.targetLinks = [];
  });

  links.forEach(link => {
    const source = link.sourceNode;
    const target = link.targetNode;
    source.sourceLinks.push(link);
    target.targetLinks.push(link);
    link.sourceNodeLayerIndex = source.shownLayerIndex;
    link.targetNodeLayerIndex = target.shownLayerIndex;
    link.sourceNode = null;
    link.targetNode = null;
  });

  return {
    nodes,
    links
  };
};

const computeNodeValues = nodes => {
  nodes.forEach(function(node) {
    node.value = Math.max(
       d3_sum(node.sourceLinks, link => link.value),
       d3_sum(node.targetLinks, link => link.value)
     );
  });
  return nodes;
};
