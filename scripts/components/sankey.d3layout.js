import wrapSVGText from 'utils/wrapSVGText';
import { NUM_COLUMNS, DETAILED_VIEW_MIN_NODE_HEIGHT, DETAILED_VIEW_SCALE } from 'constants';
import { interpolateNumber as d3_interpolateNumber } from 'd3-interpolate';

const PADDING_X = 16;
const PADDING_Y_TOP = 16;
const PADDING_Y_BOTTOM = 0;

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
  let detailedView;
  let maxHeight;

  // layout
  let linksColumnWidth;
  let _labelCharsPerLine;
  const _labelCharWidth = 9;
  const _labelCharHeight = 16;
  const _labelMaxLines = 3;

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

  sankeyLayout.isReady = () => {
    return viewportWidth && linksPayload;
  };

  sankeyLayout.relayout = () => {
    if (!sankeyLayout.isReady()) {
      console.warn('not ready');
      return false;
    }
    columns = linksPayload.visibleNodesByColumn;
    links = linksPayload.links;
    detailedView = linksPayload.detailedView;

    _computeNodeCoords();
    _computeLinksCoords();
    _setNodeLabels();

    return true;
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

  sankeyLayout.getMaxHeight = () => {
    return maxHeight;
  };

  const _computeNodeCoords = () => {
    const availableLinkSpace = viewportWidth - NUM_COLUMNS * columnWidth - PADDING_X * 2;
    linksColumnWidth = availableLinkSpace/(NUM_COLUMNS - 1);

    maxHeight = 0;

    columns.forEach((column, i) => {
      column.x = _getColumnX(i);
      let columnY = PADDING_Y_TOP;
      column.values.forEach(node => {
        node.x = column.x;
        node.y = columnY;
        if (detailedView === true) {
          node.renderedHeight = Math.max(DETAILED_VIEW_MIN_NODE_HEIGHT, DETAILED_VIEW_SCALE * node.height);
        } else {
          node.renderedHeight = node.height * (viewportHeight - PADDING_Y_TOP + PADDING_Y_BOTTOM);
        }
        columnY += node.renderedHeight;
      });
      if (columnY > maxHeight) {
        maxHeight = columnY;
      }
    });
  };

  const _setNodeLabels = () => {
    columns.forEach(column => {
      column.values.forEach(node => {
        node.label = wrapSVGText(node.name, node.renderedHeight, _labelCharHeight, _labelCharsPerLine, _labelMaxLines);
      });
    });
  };

  // compute links y and y deltas (later used by sankey.link generator)
  // will be called at each relayouting (user clicks nodes, user scrolls, etc)
  const _computeLinksCoords = () => {

    // source and target are dicts (nodeIds are keys) containing the cumulated height of all links for each node
    const stackedHeightsByNodeId = {source:{},target:{}};

    // retrieve node ys to bootstrap stackedHeights
    links.forEach(link => {
      const sId = link.sourceNodeId;
      stackedHeightsByNodeId.source[sId] = _getNode(link.sourceColumnPosition, sId).y;

      const tId = link.targetNodeId;
      stackedHeightsByNodeId.target[tId] = _getNode(link.targetColumnPosition, tId).y;
    });


    // sort links by node source and target y positions
    // TODO move sorting to reducer
    links.sort((linkA, linkB) => {
      const sIdAY = stackedHeightsByNodeId.source[linkA.sourceNodeId];
      const sIdBY = stackedHeightsByNodeId.source[linkB.sourceNodeId];
      const tIdAY = stackedHeightsByNodeId.target[linkA.targetNodeId];
      const tIdBY = stackedHeightsByNodeId.target[linkB.targetNodeId];
      let sort = sIdAY - sIdBY || tIdAY - tIdBY;
      if (linkA.ind !== undefined && linkA.ind !== 'none' && linkB.ind !== undefined && linkB.ind !== 'none') {
        sort = linkA.ind - linkB.ind || sort;
      }
      if (linkA.qual !== undefined && linkA.qual !== 'none' && linkB.qual !== undefined && linkB.qual !== 'none') {
        // sorts alphabetically with quals
        // TODO use the order presentend in the color by menu
        sort = linkA.qual.charCodeAt(0) - linkB.qual.charCodeAt(0) || sort;
      }

      return sort;
    });

    links.forEach(link => {
      link.width = linksColumnWidth;
      link.x = columnWidth + _getColumnX(link.sourceColumnPosition);

      if (detailedView === true) {
        link.renderedHeight = link.height * DETAILED_VIEW_SCALE;
      } else {
        link.renderedHeight = link.height * (viewportHeight - PADDING_Y_TOP + PADDING_Y_BOTTOM);
      }

      const sId = link.sourceNodeId;
      link.sy = stackedHeightsByNodeId.source[sId];
      stackedHeightsByNodeId.source[sId] = link.sy + link.renderedHeight;

      const tId = link.targetNodeId;
      link.ty = stackedHeightsByNodeId.target[tId];
      stackedHeightsByNodeId.target[tId] = link.ty + link.renderedHeight;
    });
  };

  const _getColumnX = (columnIndex) => PADDING_X + columnIndex * (columnWidth + linksColumnWidth);

  const _getNode = (columnPosition, nodeId) => {
    const column = columns[columnPosition];
    return column.values.find(node => node.id === nodeId);
  };

  return sankeyLayout;
};

export default sankeyLayout;
