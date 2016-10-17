const byHeightOthersLast = (nodeA, nodeB) => {
  if (nodeA.isAggregated) {
    return 1;
  } else if (nodeB.isAggregated) {
    return -1;
  }
  return byHeight(nodeA, nodeB);
};

const byHeight = (nodeA, nodeB) => {
  return (nodeA.height > nodeB.height) ? -1 : 1;
};

// TODO: add sorting by selectedNodes in detailed mode here
export default function(visibleNodesByColumn) {
  visibleNodesByColumn.forEach(column => {
    column.values.sort(byHeightOthersLast);
  });

  return visibleNodesByColumn;
}
