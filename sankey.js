/* global d3 */
/*eslint no-console: 0*/

d3.sankey = function() {
  const sankey = {};
  let nodes = [];
  let links = [];
  let layers = [];

  let layerWidth = 80;
  let layerSpacing = 200;
  let scaleY = .00005;

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.layers = function() {
    return layers;
  };

  sankey.layerWidth = _ => {
    if (!_) return layerWidth;
    layerWidth = +_;
    return sankey;
  };

  sankey.layerSpacing = _ => {
    if (!_) return layerSpacing;
    layerSpacing = +_;
    return sankey;
  };

  sankey.scaleY = _ => {
    if (!_) return scaleY;
    scaleY = +_;
    return sankey;
  };

  sankey.link = function() {
    var curvature = .5;

    function link(d) {
      var x0 = d.x,
        x1 = d.x + d.dx,
        xi = d3.interpolateNumber(x0, x1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature),
        y0 = d.sy + d.dy / 2,
        y1 = d.ty+ d.dy / 2;
      return 'M' + x0 + ',' + y0
           + 'C' + x2 + ',' + y0
           + ' ' + x3 + ',' + y1
           + ' ' + x1 + ',' + y1;
    }

    link.curvature = function(_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  const getNodeIndex = (nodeId) => {
    return nodes.findIndex(n => parseInt(nodeId, 10) === parseInt(n.id, 10));
  };

  const getNode = (nodeId) => {
    return nodes.find(n => parseInt(nodeId, 10) === parseInt(n.id, 10));
  };


  //break down links into simple src - target tuples
  const breakDownLinks = () => {
    var linkTuples = [];
    links.forEach(link => {
      var path = link.attributes.path;
      for (var i = 0; i < path.length-1; i++) {
        linkTuples.push({
          // sourceNodeIndex: getNodeIndex(path[i]),
          // targetNodeIndex: getNodeIndex(path[i+1]),
          sourceNodeId: path[i],
          targetNodeId: path[i+1],
          sourceNode: getNode(path[i]),
          targetNode: getNode(path[i+1]),
          attributes: link.attributes,
          value: parseFloat(link.attributes.flowQuants[0].quantValue)
        });
      }
    });
    links = linkTuples;
  };

  const computeNodeLinks = () => {
    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });

    links.forEach(link => {
      // const source = nodes[link.sourceNodeIndex];
      // const target = nodes[link.targetNodeIndex];
      const source = link.sourceNode;
      const target = link.targetNode;
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  };

  const mergeDuplicateLinks = () => {
    const dict = {};
    const mergedLinks = [];
    links.forEach(link => {
      const key = link.sourceNodeId + '' + link.targetNodeId;
      if (!dict[key]) {
        mergedLinks.push(link);
        dict[key] = link;
      } else {
        dict[key].value += link.value;
      }
    });
    // console.log(mergedLinks.map(l => l.value))
    links = mergedLinks;
  };

  const computeLayers = () => {
    layers = d3.nest()
      .key(el => el.attributes.nodeType)
      .entries(nodes);

    layers.forEach((layer, i) => {
      layer.values.forEach(node => {
        node.layer = layer;
      });
    });
  };

  const computeNodeValues = () => {
    nodes.forEach(function(node) {
      node.value = Math.max(
         d3.sum(node.sourceLinks, link => link.value),
         d3.sum(node.targetLinks, link => link.value)
       );
    });
  };

  const sortNodes = sortFun => {
    layers.forEach(layer => {
      layer.values.sort(sortFun);
    });
  };

  const sortLinksByNode = sortFun => {
    layers.forEach(layer => {
      layer.values.forEach(node => {
        node.sourceLinks.sort(sortFun);
        node.targetLinks.sort(sortFun);
      });
    });
  };

  const sortDesc = (a, b) => {
    return (a.value > b.value) ? -1 : 1;
  }

  const computeCoords = () => {
    layers.forEach((layer, i) => {
      layer.x = i * (layerWidth + layerSpacing);
      let totalHeight = 0;
      layer.values.forEach(node => {
        node.y = totalHeight;
        node.dy = node.value * scaleY;

        let totalSourceHeight = 0;
        node.sourceLinks.forEach(link => {
          link.sy = totalHeight + totalSourceHeight;
          link.dy = link.value * scaleY;
          totalSourceHeight += link.dy;
        });
        let totalTargetHeight = 0;
        node.targetLinks.forEach(link => {
          link.ty = totalHeight + totalTargetHeight;
          link.dy = link.value * scaleY; //probably not necessary
          totalTargetHeight += link.dy;
        });

        totalHeight += node.dy;
      });
    });

    links.forEach(link => {
      link.x = layerWidth + link.sourceNode.layer.x;
      link.dx = layerSpacing;
      // link.y = link.source
    });
  };

  sankey.layout = function() {
    breakDownLinks();
    mergeDuplicateLinks();
    computeNodeLinks();
    computeLayers();
    computeNodeValues();
    sortNodes(sortDesc);
    sortLinksByNode(sortDesc);
    computeCoords();
    return sankey;
  };



  return sankey;
};
