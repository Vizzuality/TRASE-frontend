export default (nodesIds, state) => {
  if (!nodesIds || !nodesIds[0]) {
    return {
      ids: [],
      data: [],
      geoIds: [],
      columnsPos: []
    };
  }

  const data = getSelectedNodesData(nodesIds, state.visibleNodes, state.nodesDictWithMeta, state.selectedMapDimensions, state.selectedResizeBy.label);
  const geoIds = data.map(node => node.geoId).filter(geoId => geoId !== undefined && geoId !== null);
  const columnsPos = data.map(node => node.columnGroup);

  return {
    ids: nodesIds,
    data,
    geoIds,
    columnsPos
  };
};

const getSelectedNodesData = (selectedNodesIds, visibleNodes, nodesDictWithMeta, selectedMapDimensions, selectedResizeByLabel) => {
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
        if (selectedMapDimensions[0] !== null) {
          meta = node.meta[selectedMapDimensions[0]];
          if (meta && meta.name !== selectedResizeByLabel) {
            node.selectedMetas.push(meta);
          } else if (visibleNode && visibleNode.quant && meta.rawValue !== visibleNode.quant) {
            // See https://basecamp.com/1756858/projects/12498794/todos/312319406
            console.warn(
              'Attempting to show different values two dimensions with the same name.',
              'ResizeBy: ' + selectedResizeByLabel + ' with value ' + visibleNode.quant,
              'Map layer: ' + meta.name + ' with value ' + meta.rawValue
            );
          }
        }
        if (selectedMapDimensions[1] !== null) {
          meta = node.meta[selectedMapDimensions[1]];
          if (meta && meta.name !== selectedResizeByLabel) {
            node.selectedMetas.push(meta);
          } else if (visibleNode && visibleNode.quant && meta.rawValue !== visibleNode.quant) {
            // See https://basecamp.com/1756858/projects/12498794/todos/312319406
            console.warn(
              'Attempting to show different values two dimensions with the same name.',
              'ResizeBy: ' + selectedResizeByLabel + ' with value ' + visibleNode.quant,
              'Map layer: ' + meta.name + ' with value ' + meta.rawValue
            );
          }
        }
      }
    }

    if (visibleNode) {
      node = Object.assign(node, visibleNode);
    }
    return node;
  });
};
