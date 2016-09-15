export default function(columns, columnIndexes) {
  return columnIndexes.map(index => {
    const column = columns.find(column => parseInt(column.id) === index);
    return {
      index,
      name: column.attributes.nodeType
    };
  });
}
