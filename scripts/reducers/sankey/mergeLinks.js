import _ from 'lodash';

// merges same origin / same destination / same qual links
export default function(links) {
  const mergedLinks = [];
  let dict = {};

  for (var i = 0; i < links.length; i++) {
    var link = links[i];

    const key = '' + link.sourceNodeId + link.targetNodeId + link.qual + link.ind;
    if (!dict[key]) {
      const mergedLink = _.cloneDeep(link);
      mergedLink.id = key;
      mergedLinks.push(mergedLink);
      dict[key] = mergedLink;
    } else {
      dict[key].height += link.height;
      dict[key].quant += link.quant;
    }
  }

  return mergedLinks;
}
