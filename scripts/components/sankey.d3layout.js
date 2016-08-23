/*eslint no-console: 0*/
import * as _ from 'lodash';
import { interpolateNumber as d3_interpolateNumber } from 'd3-interpolate';
import getNode from 'utils/sankey.getNode';

const sankey = function(payload) {
  const sankey = {};
  let {nodes, layers, links} = payload;
  let selectedNodeIds;

  // default display values - FIXME remove those
  let layerWidth = 80;
  let layerSpacing = 200;
  let scaleY = .00006;
  let minNodeHeight = 30;

  let maxLabelCharsWidth;
  let maxLabelLines;
  let _labelCharsPerLine;
  const labelCharSize = 9;

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

  // using precomputed dimensions on links objects, this will generate SVG paths for links
  sankey.link = function() {
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
        xi = d3_interpolateNumber(x0, x1),
        x2 = xi(.75),
        x3 = xi(.25),
        y0 = d.sy + d.dy / 2,
        y1 = d.ty+ d.dy / 2;
      return 'M' + x0 + ',' + y0
           + 'C' + x2 + ',' + y0
           + ' ' + x3 + ',' + y1
           + ' ' + x1 + ',' + y1;
    }

    return link;
  };

  // sankey.mapLink = function() {
  //
  //   function link(d) {
  //     var x0 = d.x,
  //       x1 = d.x + d.dx,
  //       xi = d3.interpolateNumber(x0, x1),
  //       x2 = xi(.75),
  //       x3 = xi(.25),
  //       y0 = d.sy,
  //       y1 = d.ty;
  //     return 'M' + x0 + ',' + y0
  //          + 'C' + x2 + ',' + y0
  //          + ' ' + x3 + ',' + y1
  //          + ' ' + x1 + ',' + y1;
  //   }
  //
  //   return link;
  // };

  // formats/create ellipsis nodes text using # of lines available, node width, etc
  const prepareNodesText = () => {
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
        node.nodeNameLinesShown[0] = node.nodeNameLinesShown[0];

        // ellipsis
        if (node.nodeNameLines.length > maxLabelLines) {
          node.nodeNameLinesShown[maxLabelLines - 1] = node.nodeNameLinesShown[maxLabelLines - 1] + '…';
        }
      });
    });
  };

  // sort nodes by their values, using some sortFun function
  const sortNodes = sortFun => {
    layers.forEach(layer => {
      layer.values.sort(sortFun);
    });
  };

  // sort links inside each node, using some sortFun function
  const sortLinksByNode = sortFun => {
    layers.forEach(layer => {
      layer.values.forEach(node => {
        node.sourceLinks.sort(sortFun);
        node.targetLinks.sort(sortFun);
      });
    });
  };

  // below, functions used in sorting of nodes and links
  const sortDesc = (a, b) => {
    return (a.value > b.value) ? -1 : 1;
  };

  // Desc sorting while always keeping 'other' nodes last
  // (other nodes are aggregations of small nodes done by the API)
  const sortDescOtherLast = (a, b) => {
    if (a.isOther) return 1;
    else if (b.isOther) return -1;
    else
    return (a.value < b.value) ? 1 : -1;
  };

  // Desc sorting, 'other' nodes always last, but always putting selected nodes first
  // selected nodes = nodes related to a clicked node by any link
  // FIXME selectedNodeIds should not be some global list floating around
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

  // compute x and x deltas for layers and links
  // as opposed to vertical coords, those shouldn't need to change when relayouting
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

  // compute nodes y and y deltas, by stacking them up
  // will be called at each relayouting (user clicks nodes, etc)
  const computeNodesVerticalCoords = () => {
    layers.forEach(layer => {
      let totalHeight = 0;
      layer.values.forEach(node => {
        node.y = totalHeight;
        node.dy = Math.max(node.value * scaleY, minNodeHeight);
        totalHeight += node.dy;
      });
      layer.dy = totalHeight;
    });
  };

  // compute links y and y deltas (later used by sankey.link generator)
  // will be called at each relayouting (user clicks nodes, user scrolls, etc)
  const computeMergedLinksVerticalCoords = (links, layerOffsets) => {
    const stackedHeightsByNodeId = {source:{},target:{}};

    links.forEach(link => {
      link.dy = link.value * scaleY;


      const sId = link.sourceNodeId;
      if (!stackedHeightsByNodeId.source[sId]) stackedHeightsByNodeId.source[sId] = getNode(nodes, sId).y;
      link.sy = stackedHeightsByNodeId.source[sId];
      stackedHeightsByNodeId.source[sId] = link.sy + link.dy;

      const sLayerIndex = link.sourceNodeLayerIndex;
      if (layerOffsets && layerOffsets[sLayerIndex]) {
        link.sy += layerOffsets[sLayerIndex];
      }

      const tId = link.targetNodeId;
      if (!stackedHeightsByNodeId.target[tId]) stackedHeightsByNodeId.target[tId] = getNode(nodes, tId).y;
      link.ty = stackedHeightsByNodeId.target[tId];
      stackedHeightsByNodeId.target[tId] = link.ty + link.dy;

      const tLayerIndex = link.targetNodeLayerIndex;
      if (layerOffsets && layerOffsets[tLayerIndex]) {
        link.ty += layerOffsets[tLayerIndex];
      }
    });
  };

  // call this only onece after data has been loaded
  sankey.layout = function() {
    // build node text labels
    prepareNodesText();

    sortNodes(sortDescOtherLast);
    sortLinksByNode(sortDesc);

    // add y pos and height values to nodes and links
    computeHorizontalCoords();
    computeNodesVerticalCoords();
    return sankey;
  };

  // reorder nodes by proximity (=some link connection) with node clicked (selectedNodeId)
  // FIXME layersOffsets should not need to be passed
  sankey.reorderNodes = (selectedNodeId, linksData, layersOffsets) => {
    selectedNodeIds = _
      .chain(links)
      // get all links tuples that have selectedNodeId in their original full link path
      .filter(link => link.originalPath.indexOf(selectedNodeId) > -1)
      // get source and target nodes ids
      .map(link => [link.sourceNodeId, link.targetNodeId])
      // get a flat array of node ids
      .flatten()
      // remove duplicate node ids
      .uniq()
      .value();

    sortNodes(sortDescOtherLastSelectedFirst); // TODO uses selectedNodeIds, should be sent as an arg not used as a global var
    computeNodesVerticalCoords();
    computeMergedLinksVerticalCoords(linksData, layersOffsets);
  };

  // get all links connected to a node, directly, or indirectly (have selectedNodeId in their original full link path)
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

  // set y offsets to offset links, used for scrolling
  sankey.setLayersOffsets = (linksData, layersOffsets) => {
    computeMergedLinksVerticalCoords(linksData, layersOffsets);
    return linksData;
  };

  return sankey;
};

export default sankey;
