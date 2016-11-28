import _ from 'lodash';

// filter links using node Ids. Makes a copy of the original links object
export default function(links, selectedNodesIds, selectedNodesAtColumns, nodesColoredBySelection) {
  const filteredLinks = [];

  for (let i = 0, linksLen = links.length; i < linksLen; i++) {
    const link = links[i];
    const linkPasses = filterPath(link.originalPath, selectedNodesAtColumns);
    if (linkPasses) {
      let clonedLink = _.cloneDeep(link);
      const highlightLinkNodes = _.intersection(link.originalPath, nodesColoredBySelection);
      if (highlightLinkNodes) {
        clonedLink.recolourGroup = nodesColoredBySelection.length - nodesColoredBySelection.indexOf(highlightLinkNodes[0]);
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
};
