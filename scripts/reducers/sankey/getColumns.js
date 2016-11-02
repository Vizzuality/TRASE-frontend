// TODO remove this code when API is updated
export default function(rawColumns, columnsPos) {
  const columns = [];
  rawColumns.forEach(rawColumn => {
    const column = {
      id: rawColumn.id,
      name: '' + rawColumn.id
    };
    column.position = columnsPos.findIndex(columnPos => columnPos.indexOf(column.id) > -1);
    columns.push(column);
  });
  return columns;
}
