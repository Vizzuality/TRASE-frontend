import { NUM_COLUMNS } from 'constants';
import { interpolateNumber as d3_interpolateNumber } from 'd3-interpolate';


const sankeyLayout = function() {
  const sankeyLayout = {};

  // in
  let viewportWidth;
  let viewportHeight;
  let linksPayload;
  let columnWidth;

  // data
  let columns;
  let links;

  // layout
  let linksColumnWidth;
  let _labelCharsPerLine;
  const _labelCharWidth = 9;
  const _labelCharHeight = 16;
  const _labelMaxLines = 2;

  sankeyLayout.setViewportSize = (size) => {
    viewportWidth = size[0];
    viewportHeight = size[1];
  };

  sankeyLayout.setLinksPayload = (payload) => {
    linksPayload = payload;
  };

  sankeyLayout.columnWidth = _ => {
    if (!_) return columnWidth;
    columnWidth = +_;
    _labelCharsPerLine = Math.floor(columnWidth/_labelCharWidth);
    return sankeyLayout;
  };

  sankeyLayout.columns = () => {
    return columns;
  };

  sankeyLayout.links = () => {
    return links;
  };

  sankeyLayout.relayout = () => {
    if (!viewportWidth || !linksPayload) {
      console.warn('not ready');
      return false;
    }

    columns = linksPayload.visibleNodes;
    links = linksPayload.links;

    _sortNodes();
    _computeNodeCoords();
    _computeLinksCoords();

    return true;
  };

  // formats/create ellipsis nodes text using # of lines available, node width, etc
  sankeyLayout.getNodeLabel = (name, nodeRenderedHeight) => {

    var words = name.split(' ');
    var currentLine = '';
    const nodeNameLines = [];
    words.forEach(word => {
      var line = currentLine + ' ' + word;
      if (line.length > _labelCharsPerLine) {
        nodeNameLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = line;
      }
    });
    nodeNameLines.push(currentLine);

    const maxLinesForNode = Math.max(1, Math.min(_labelMaxLines, Math.floor(nodeRenderedHeight / _labelCharHeight)));
    const nodeNameLinesShown = nodeNameLines.slice(0, maxLinesForNode);

    // ellipsis
    if (nodeNameLines.length > maxLinesForNode) {
      nodeNameLinesShown[maxLinesForNode - 1] = nodeNameLinesShown[maxLinesForNode - 1] + '…';
    }
    return nodeNameLinesShown;
  };

  // using precomputed dimensions on links objects, this will generate SVG paths for links
  sankeyLayout.link = function() {
    function link(d) {
      var x0 = d.x,
        x1 = d.x + d.width,
        xi = d3_interpolateNumber(x0, x1),
        x2 = xi(.75),
        x3 = xi(.25),
        y0 = d.sy + d.renderedHeight / 2,
        y1 = d.ty + d.renderedHeight / 2;
      const path = 'M' + x0 + ',' + y0
           + 'C' + x2 + ',' + y0
           + ' ' + x3 + ',' + y1
           + ' ' + x1 + ',' + y1;
      return path;
    }

    return link;
  };


  const _sortNodes = () => {
    columns.forEach(column => {
      column.values.sort(_sortNodesDesc);
    });
  };

  const _sortNodesDesc = (a, b) => {
    return (a.height > b.height) ? -1 : 1;
  };

  const _computeNodeCoords = () => {
    const availableLinkSpace = viewportWidth - NUM_COLUMNS * columnWidth;
    linksColumnWidth = availableLinkSpace/(NUM_COLUMNS - 1);

    columns.forEach((column, i) => {
      column.x = _getColumnX(i);
      let columnY = 0;
      column.values.forEach(node => {
        node.y = columnY;
        node.renderedHeight = node.height * viewportHeight;
        columnY += node.renderedHeight;
      });
    });
  };

  // compute links y and y deltas (later used by sankey.link generator)
  // will be called at each relayouting (user clicks nodes, user scrolls, etc)
  const _computeLinksCoords = () => {
    const stackedHeightsByNodeId = {source:{},target:{}};

    links.forEach(link => {
      link.width = linksColumnWidth;
      link.x = columnWidth + _getColumnX(_getColumnIndex(link.sourceColumnId));
      link.renderedHeight = link.height * viewportHeight;

      const sId = link.sourceNodeId;
      if (!stackedHeightsByNodeId.source[sId]) stackedHeightsByNodeId.source[sId] = _getNode(link.sourceColumnId, sId).y;
      link.sy = stackedHeightsByNodeId.source[sId];
      stackedHeightsByNodeId.source[sId] = link.sy + link.renderedHeight;

      // const sLayerIndex = link.sourceNodeLayerIndex;
      // if (layerOffsets && layerOffsets[sLayerIndex]) {
      //   link.sy += layerOffsets[sLayerIndex];
      // }

      const tId = link.targetNodeId;
      if (!stackedHeightsByNodeId.target[tId]) stackedHeightsByNodeId.target[tId] = _getNode(link.targetColumnId, tId).y;
      link.ty = stackedHeightsByNodeId.target[tId];
      stackedHeightsByNodeId.target[tId] = link.ty + link.renderedHeight;

      // const tLayerIndex = link.targetNodeLayerIndex;
      // if (layerOffsets && layerOffsets[tLayerIndex]) {
      //   link.ty += layerOffsets[tLayerIndex];
      // }
    });
  };

  const _getColumnX = (columnIndex) => columnIndex * (columnWidth + linksColumnWidth);

  const _getColumnIndex = (columnId) => columns.findIndex(column => column.columnId === columnId);

  const _getNode = (columnId, nodeId) => {
    const columnIndex = _getColumnIndex(columnId);
    const column = columns[columnIndex];
    return column.values.find(node => node.id === nodeId);
  };


  return sankeyLayout;
};

export default sankeyLayout;
