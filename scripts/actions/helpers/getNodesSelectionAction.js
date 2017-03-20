export default (nodesIds, state) => {
  if (!nodesIds || !nodesIds[0]) {
    return {
      ids: [],
      data: [],
      geoIds: [],
      columnsPos: []
    };
  }

  const data = getSelectedNodesData(nodesIds, state.visibleNodes, state.nodesDictWithMeta, state.selectedMapDimensions);
  const geoIds = data.map(node => node.geoId).filter(geoId => geoId !== undefined && geoId !== null);
  const columnsPos = data.map(node => node.columnGroup);

  return {
    ids: nodesIds,
    data,
    geoIds,
    columnsPos
  };
};

const getSelectedNodesData = (selectedNodesIds, visibleNodes, nodesDictWithMeta, selectedMapDimensions) => {
  if (selectedNodesIds === undefined || visibleNodes === undefined) {
    return [];
  }

  return selectedNodesIds.map(nodeId => {
    const visibleNode = visibleNodes.find(node => node.id === nodeId);
    let node = {};

    // get_nodes might still be loading at this point, in this case just skip adding metadata
    if (nodesDictWithMeta) {
      node = Object.assign(node, nodesDictWithMeta[nodeId]);
      // add metas from the map layers to the selected nodes data
      node.selectedMetas = [];
      let meta;
      if (node.meta) {
        if (selectedMapDimensions.horizontal.uid) {
          meta = node.meta[selectedMapDimensions.horizontal.uid];
          if (meta) node.selectedMetas.push(meta);
        }
        if (selectedMapDimensions.vertical.uid) {
          meta = node.meta[selectedMapDimensions.vertical.uid];
          if (meta) node.selectedMetas.push(meta);
        }
      }
    }

    if (visibleNode) {
      node = Object.assign(node, visibleNode);
    }
    return node;
  });
};