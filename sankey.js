/* global d3 */
/* global _ */
/*eslint no-console: 0*/

d3.sankey = function() {
  const sankey = {};
  let nodes = [];
  let links = [];
  // let mergedLinks = [];
  let layers = [];
  let selectedNodeIds;

  let layerWidth = 80;
  let layerSpacing = 200;
  let scaleY = .00006;
  let minNodeHeight = 30;

  let maxLabelCharsWidth;
  let maxLabelLines;
  let _labelCharsPerLine;
  const labelCharSize = 9;

  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function(_) {
    if (!arguments.length) return;
    links = _;
    return sankey;
  };

  // sankey.mergedLinks = function() {
  //   return mergedLinks;
  // };

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

  sankey.minNodeHeight = _ => {
    if (!_) return minNodeHeight;
    minNodeHeight = +_;
    return sankey;
  };

  sankey.maxLabelCharsWidth = _ => {
    if (!_) return maxLabelCharsWidth;
    maxLabelCharsWidth = +_;
    _labelCharsPerLine = Math.floor(maxLabelCharsWidth/labelCharSize);
    return sankey;
  };

  sankey.maxLabelLines = _ => {
    if (!_) return maxLabelLines;
    maxLabelLines = +_;
    return sankey;
  };

  sankey.link = function() {
    var curvature = 1 ;

    function link(d) {
      // const r = d.sy/1000;
      // // console.log(r);
      //
      // var xStart = d.x,
      //   xEnd = d.x + d.dx,
      //   xi = d3.interpolateNumber(xStart, xEnd),
      //   x0 = xi(Math.min(r, 0.7)),
      //   x1 = xi(Math.min(r+0.5,1)),
      //   x2 = x0+70,
      //   x3 = x1-70,
      //   y0 = d.sy + d.dy / 2,
      //   y1 = d.ty+ d.dy / 2;
      // return 'M' + x0 + ',' + y0
      //      + 'C' + x2 + ',' + y0
      //      + ' ' + x3 + ',' + y1
      //      + ' ' + x1 + ',' + y1;
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
        node.shownLayerIndex = i;
        node.id = parseInt(node.id);
      });
    });
  };

  const computeNodeLinks = () => {
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
  };

  const prepareNodesText = () => {
    console.log(_labelCharsPerLine);
    layers.forEach(layer => {
      layer.values.forEach(node => {
        var words = node.attributes.nodeName.split(' ');
        var currentLine = '';
        node.nodeNameLines = [];
        words.forEach(word => {
          var line = currentLine + ' ' + word;
          if (line.length > _labelCharsPerLine) {
            node.nodeNameLines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = line;
          }
        });
        node.nodeNameLines.push(currentLine);
        node.nodeNameLinesShown = node.nodeNameLines.slice(0, maxLabelLines);

        // ellipsis
        if (node.nodeNameLines.length > maxLabelLines) {
          node.nodeNameLinesShown[maxLabelLines - 1] = node.nodeNameLinesShown[maxLabelLines - 1] + '…';
        }
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

  const sortDescOtherLastSelectedFirst = (a, b) => {
    if (a.isOther) return 1;
    else if (b.isOther) return -1;
    else {
      const aSelected = selectedNodeIds.indexOf(parseInt(a.id)) > -1;
      const bSelected = selectedNodeIds.indexOf(parseInt(b.id)) > -1;
      if (aSelected && !bSelected) {
        return -1;
      } else if (!aSelected && bSelected) {
        return 1;
      } else {
        return (a.value < b.value) ? 1 : -1;
      }
    }
  };

  const computeHorizontalCoords = () => {
    layers.forEach((layer, i) => {
      layer.x = i * (layerWidth + layerSpacing);
      layer.values.forEach(node => {
        node.sourceLinks.forEach(link => {
          link.x = -layerSpacing+layer.x;
          link.dx = layerSpacing;
        });
        node.targetLinks.forEach(link => {
          link.x = -layerSpacing + layer.x;
          link.dx = layerSpacing;
        });
      });
    });
  };

  const computeNodesVerticalCoords = () => {
    layers.forEach(layer => {
      let totalHeight = 0;
      layer.values.forEach(node => {
        node.y = totalHeight;
        node.dy = Math.max(node.value * scaleY, minNodeHeight);
        totalHeight += node.dy;
      });
    });
  };

  const computeMergedLinksVerticalCoords = (links, layerOffsets) => {
    const stackedHeightsByNodeId = {source:{},target:{}};

    links.forEach(link => {
      link.dy = link.value * scaleY;


      const sId = link.sourceNodeId;
      if (!stackedHeightsByNodeId.source[sId]) stackedHeightsByNodeId.source[sId] = getNode(sId).y;
      link.sy = stackedHeightsByNodeId.source[sId];
      stackedHeightsByNodeId.source[sId] = link.sy + link.dy;

      const sLayerIndex = link.sourceNodeLayerIndex;
      if (layerOffsets && layerOffsets[sLayerIndex]) {
        link.sy += layerOffsets[sLayerIndex];
      }

      const tId = link.targetNodeId;
      if (!stackedHeightsByNodeId.target[tId]) stackedHeightsByNodeId.target[tId] = getNode(tId).y;
      link.ty = stackedHeightsByNodeId.target[tId];
      stackedHeightsByNodeId.target[tId] = link.ty + link.dy;

      const tLayerIndex = link.targetNodeLayerIndex;
      if (layerOffsets && layerOffsets[tLayerIndex]) {
        link.ty += layerOffsets[tLayerIndex];
      }
    });
  };

  sankey.layout = function() {
    // build simpler node-node link tuples
    breakDownLinks();
    // group nodes by layers
    computeLayers();
    // build node text labels
    prepareNodesText();
    // attach original links to nodes
    computeNodeLinks();
    // compute cumulated node values
    computeNodeValues();
    sortNodes(sortDescOtherLast);
    sortLinksByNode(sortDesc);

    // add y pos and height values to nodes and links
    computeHorizontalCoords();
    computeNodesVerticalCoords();
    return sankey;
  };

  sankey.reorderNodes = (selectedNodeId, linksData, layersOffsets) => {
    selectedNodeIds = _
      .chain(links)
      .filter(link => link.originalPath.indexOf(selectedNodeId) > -1)
      .map(link => [link.sourceNodeId, link.targetNodeId])
      .flatten()
      .uniq()
      .value();

    sortNodes(sortDescOtherLastSelectedFirst); // TODO uses selectedNodeIds, should be sent as an arg not used as a global var
    computeNodesVerticalCoords();
    computeMergedLinksVerticalCoords(linksData, layersOffsets);
  };

  sankey.getLinksForNodeId = (nodeId, layersOffsets) => {
    // merge links that have same source and target node
    const mergedLinks = [];
    let dict = {};

    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.originalPath.indexOf(nodeId) === -1) continue;

      const key = link.sourceNodeId + '' + link.targetNodeId;
      if (!dict[key]) {
        const mergedLink = _.cloneDeep(link);
        mergedLinks.push(mergedLink);
        dict[key] = mergedLink;
      } else {
        dict[key].value += link.value;
      }
    }

    computeMergedLinksVerticalCoords(mergedLinks, layersOffsets);

    return mergedLinks;
  };

  sankey.setLayersOffsets = (linksData, layersOffsets) => {
    computeMergedLinksVerticalCoords(linksData, layersOffsets);
    return linksData;
  };

  return sankey;
};
