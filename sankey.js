/* global d3 */
/* global _ */
/*eslint no-console: 0*/

d3.sankey = function() {
  const sankey = {};
  let nodes = [];
  let links = [];
  let mergedLinks = [];
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

  sankey.mergedLinks = function() {
    return mergedLinks;
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
    var curvature = 1 ;

    function link(d) {
      var x0 = d.x,
        x1 = d.x + d.dx,
        xi = d3.interpolateNumber(x0, x1),
        x2 = xi(.75),
        x3 = xi(.25),
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
      // if (link.attributes.path.indexOf(39) > -1) console.log('!!!!')
      // console.log(link)

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
          value: parseFloat(link.attributes.flowQuants[0].quantValue),
          originalPath: path
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
      link.sourceNode = null;
      link.targetNode = null;
    });
  };

  const mergeDuplicateLinks = nodeId => {
    const dict = {};
    const mergedLinks = [];
    links.forEach(link => {
      const key = link.sourceNodeId + '' + link.targetNodeId;
      if (!dict[key]) {
        const mergedLink = _.cloneDeep(link);
        mergedLinks.push(mergedLink);
        dict[key] = mergedLink;
      } else {
        dict[key].value += link.value;
      }
    });
    // console.log(mergedLinks.map(l => l.value))]
    console.log(links.length);
    console.log(mergedLinks.length);
    return mergedLinks;
  };

  const computeLayers = () => {
    layers = d3.nest()
      .key(el => {
        return el.attributes.nodeType;
      })
      .sortKeys((a, b) => {
        return (window.layerNames.indexOf(a) < window.layerNames.indexOf(b)) ? -1 : 1;
      })
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
  };

  const sortDescOtherLast = (a, b) => {
    if (a.isOther) return 1;
    else if (b.isOther) return -1;
    else
    return (a.value < b.value) ? 1 : -1;
  };

  const computeCoords = () => {
    layers.forEach((layer, i) => {
      layer.x = i * (layerWidth + layerSpacing);
      let totalHeight = 0;
      layer.values.forEach(node => {
        node.y = totalHeight;
        node.dy = node.value * scaleY;

        let totalSourceHeight = 0;
        node.sourceLinks.forEach(link => {
          link.x = -layerSpacing+layer.x;
          link.dx = layerSpacing;
          link.sy = totalHeight + totalSourceHeight;
          link.dy = link.value * scaleY;
          totalSourceHeight += link.dy;
        });
        let totalTargetHeight = 0;
        node.targetLinks.forEach(link => {
          link.x = -layerSpacing + layer.x;
          link.dx = layerSpacing;
          link.ty = totalHeight + totalTargetHeight;
          // link.dy = link.value * scaleY; //probably not necessary
          totalTargetHeight += link.dy;
        });

        totalHeight += node.dy;
      });
    });
  };

  sankey.layout = function() {
    // build simpler node-node link tuples
    breakDownLinks();
    // group nodes by layers
    computeLayers();
    // attach original links to nodes
    computeNodeLinks();
    // compute cumulated node values
    computeNodeValues();
    sortNodes(sortDescOtherLast);
    sortLinksByNode(sortDesc);


    // add y pos and height values to nodes and links
    computeCoords();
    return sankey;
  };

  sankey.selectNode = nodeId => {
    // merge links that have same source and target node\
    // + collect node ids for later placement
    mergedLinks = [];
    let nodeIds = [];
    let dict = {};

    var t0 = performance.now();


    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.originalPath.indexOf(nodeId) === -1) continue;

      const key = link.sourceNodeId + '' + link.targetNodeId;
      nodeIds.push(link.sourceNodeId);
      nodeIds.push(link.targetNodeId);
      if (!dict[key]) {
        const mergedLink = _.cloneDeep(link);
        mergedLinks.push(mergedLink);
        dict[key] = mergedLink;
      } else {
        dict[key].value += link.value;
      }
    }
    var t1 = performance.now();
    console.log("took " + (t1 - t0) + " milliseconds.")

    nodeIds = _.uniq(nodeIds);
    const stackedHeightsByNodeId = {source:{},target:{}};

    mergedLinks.forEach(link => {
      link.dy = link.value * scaleY;

      const sId = link.sourceNodeId;
      if (!stackedHeightsByNodeId.source[sId]) stackedHeightsByNodeId.source[sId] = getNode(sId).y;
      link.sy = stackedHeightsByNodeId.source[sId];
      stackedHeightsByNodeId.source[sId] = link.sy + link.dy;

      const tId = link.targetNodeId;
      if (!stackedHeightsByNodeId.target[tId]) stackedHeightsByNodeId.target[tId] = getNode(tId).y;
      link.ty = stackedHeightsByNodeId.target[tId];
      stackedHeightsByNodeId.target[tId] = link.ty + link.dy;
    });


  };

  return sankey;
};
