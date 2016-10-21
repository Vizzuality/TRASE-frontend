import _ from 'lodash';

// merges same origin / same destination / same qual links
export default function(links) {
  const mergedLinks = [];
  let dict = {};

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    // if (link.originalPath.indexOf(nodeId) === -1) continue;

    const key = '' + link.sourceNodeId + link.targetNodeId + link.qual;
    if (!dict[key]) {
      const mergedLink = _.cloneDeep(link);
      mergedLinks.push(mergedLink);
      dict[key] = mergedLink;
    } else {
      dict[key].height += link.height;
      dict[key].quant += link.quant;
    }
  }

  // console.log(dict)

  return mergedLinks;
}
