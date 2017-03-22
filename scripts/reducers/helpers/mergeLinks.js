import _ from 'lodash';

// merges same origin / same destination / same qual links
export default function(links, userecolorGroups) {
  const mergedLinks = [];
  let dict = {};

  for (var i = 0; i < links.length; i++) {
    var link = links[i];

    let baseKey = `${link.sourceNodeId}-${link.targetNodeId}`;
    let key = baseKey;

    if ((link.qual !== undefined && link.qual !== 'none') || (link.ind !== undefined && link.ind !== 'none')) {
      key = `${baseKey}--${link.qual}-${link.ind}`;
    } else if (userecolorGroups === true) {
      key = `${baseKey}-colourGroup${link.recolorGroup}`;
    }

    let transitionKey = baseKey;
    if (link.qual !== undefined && link.qual !== 'none') {
      transitionKey = `${transitionKey}-${link.qual}`;
    }
    if (link.ind !== undefined && link.ind !== 'none') {
      transitionKey = `${transitionKey}-${link.ind}`;
    }

    if (!dict[key]) {
      const mergedLink = _.cloneDeep(link);
      mergedLink.id = key;
      mergedLink.transitionKey = transitionKey;
      mergedLinks.push(mergedLink);
      dict[key] = mergedLink;
    } else {
      dict[key].height += link.height;
      dict[key].quant += link.quant;
    }
  }

  return mergedLinks;
}
