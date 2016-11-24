import _ from 'lodash';

// filter links using node Ids. Makes a copy of the original links object
export default function (links, selectedNodesIds, selectedNodesColumnsPos) {

  const nodesAtColumns = [];
  selectedNodesColumnsPos.forEach((columnPosition, index) => {
    const nodeId = selectedNodesIds[index];
    const column = nodesAtColumns[columnPosition];
    if (column !== undefined) {
      column.push(nodeId);
    } else {
      nodesAtColumns[columnPosition] = [nodeId];
    }
  });

  let mostSelectedNodesColumn = 0;
  for (let i = 0, nodesAtColumnsLen = nodesAtColumns.length; i < nodesAtColumnsLen; i++) {
    if (!nodesAtColumns[mostSelectedNodesColumn] || (nodesAtColumns[i] && nodesAtColumns[i].length > nodesAtColumns[mostSelectedNodesColumn].length)) {
      mostSelectedNodesColumn = i;
    }
  }
  const filteredLinks = [];

  for (let i = 0, linksLen = links.length; i < linksLen; i++) {
    const link = links[i];
    const linkPasses = filterPath(link.originalPath, nodesAtColumns);
    if (linkPasses) {
      let clonedLink = _.cloneDeep(link);
      const linkMatch = findLinkMatch(link.originalPath, nodesAtColumns, mostSelectedNodesColumn);
      if (linkMatch) {
        clonedLink.linkMatch = nodesAtColumns[mostSelectedNodesColumn].length - nodesAtColumns[mostSelectedNodesColumn].indexOf(linkMatch);
      }
      filteredLinks.push(clonedLink);
    }
  }

  return filteredLinks;
}

// keep link if path passes test:
// at each column, path should pass by one of the selected nodes for the column
// if a column does not have a selected node, path always passes for this column
const filterPath = (path, nodesAtColumns) => {
  return path.every((pathNodeId, columnPosition) => {
    const selectedNodesAtColumn = nodesAtColumns[columnPosition];
    if (selectedNodesAtColumn !== undefined) {
      if (selectedNodesAtColumn.indexOf(pathNodeId) === -1) {
        return false;
      }
    }
    return true;
  });
}

// check which of the link's nodes matches the currently selected nodes
const findLinkMatch = (path, nodesAtColumns, topColumn) => {
  const selectedNodesAtColumn = nodesAtColumns[topColumn];

  if (selectedNodesAtColumn.indexOf(path[topColumn]) !== -1) {
    return path[topColumn];
  } else {
    return false;
  }
};
