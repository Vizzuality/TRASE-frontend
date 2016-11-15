// TODO this doesn't belong to reducers/sankey
import getSelectedNodesData from 'reducers/helpers/getSelectedNodesData';

export default (nodesIds, visibleNodes, nodesDictWithMeta) => {
  if (!nodesIds || !nodesIds[0]) {
    return {
      ids: [],
      data: [],
      geoIds: [],
      columnsPos: []
    };
  }

  const data = getSelectedNodesData(nodesIds, visibleNodes, nodesDictWithMeta);
  // filter metas here
  // data[0].selectedMetas

  const geoIds = data.map(node => node.geoId).filter(geoId => geoId !== undefined);
  const columnsPos = data.map(node => node.columnPosition);

  return {
    ids: nodesIds,
    data,
    geoIds,
    columnsPos
  };
};
