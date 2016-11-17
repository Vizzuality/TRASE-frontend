export default (nodesIds, visibleNodes, nodesDictWithMeta, selectedVectorLayers) => {
  if (!nodesIds || !nodesIds[0]) {
    return {
      ids: [],
      data: [],
      geoIds: [],
      columnsPos: []
    };
  }

  const data = getSelectedNodesData(nodesIds, visibleNodes, nodesDictWithMeta, selectedVectorLayers);
  const geoIds = data.map(node => node.geoId).filter(geoId => geoId !== undefined);
  const columnsPos = data.map(node => node.columnPosition);

  return {
    ids: nodesIds,
    data,
    geoIds,
    columnsPos
  };
};

const getSelectedNodesData = (selectedNodesIds, visibleNodes, nodesDictWithMeta, selectedVectorLayers) => {
  if (selectedNodesIds === undefined) {
    return [];
  }

  return selectedNodesIds.map(nodeId => {
    const visibleNode = visibleNodes.find(node => node.id === nodeId);
    const node = _.cloneDeep(nodesDictWithMeta[nodeId]);

    // add metas from the map layers to the selected nodes data
    node.selectedMetas = [];
    let meta;
    if (selectedVectorLayers.horizontal.uid) {
      meta = node.meta[selectedVectorLayers.horizontal.uid];
      if (meta) node.selectedMetas.push(meta);
    }
    if (selectedVectorLayers.vertical.uid) {
      meta = node.meta[selectedVectorLayers.vertical.uid];
      if (meta) node.selectedMetas.push(meta);
    }

    return Object.assign(node, visibleNode);

  });
}
