import _ from 'lodash';

// filter links using node Ids. Makes a copy of the original links object
export default function(links, selectedNodesIds) {
  const filteredLinks = [];
  debugger
  for (let i = 0, linksLen = links.length; i < linksLen; i++) {
    const link = links[i];
    debugger
    if (_.intersection(link.originalPath, selectedNodesIds).length > 0) {
      filteredLinks.push(_.cloneDeep(link));
    }
  }

  return filteredLinks;
}
