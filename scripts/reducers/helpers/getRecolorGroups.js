import _ from 'lodash';

export default (previousNodesColoredBySelection, nextColoredBySelection, recolorGroups) => {
  let nextRecolorGroups = _.cloneDeep(recolorGroups) || {};

  // test for nodeIds not selected anymore
  if (previousNodesColoredBySelection) {
    previousNodesColoredBySelection.forEach(nodeId => {
      if (nextColoredBySelection.indexOf(nodeId) === -1) {
        delete nextRecolorGroups[nodeId];
      }
    });
  }

  // test for added nodeIds
  nextColoredBySelection.forEach(nodeId => {
    if (!previousNodesColoredBySelection || previousNodesColoredBySelection.indexOf(nodeId) === -1) {
      nextRecolorGroups[nodeId] = getNextNodeColorGroup(_.values(nextRecolorGroups));
    }
  });

  return nextRecolorGroups;
};

// gets the next available color group, cycling if none still available
const getNextNodeColorGroup = currentSelectedNodesColorGroups => {
  let nextColorGroup;
  let minCount = Infinity;
  for (let i = 4; i >= 1; i--) {
    let numTimesColorGroupUsed = currentSelectedNodesColorGroups.filter(colorGroup => colorGroup === i).length;
    if (numTimesColorGroupUsed <= minCount) {
      minCount = numTimesColorGroupUsed;
      nextColorGroup = i;
    }
  }
  return nextColorGroup;
};
