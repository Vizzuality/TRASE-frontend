// TODO remove this code when API is updated
export default function(rawColumns, columnsPos) {
  const columns = [];
  rawColumns.forEach(rawColumn => {
    const column = {
      id: parseInt(rawColumn.id),
      name: rawColumn.attributes.nodeType
    };
    column.position = columnsPos.findIndex(columnPos => columnPos.indexOf(column.id) > -1);
    columns.push(column);
  });
  return columns;
}
