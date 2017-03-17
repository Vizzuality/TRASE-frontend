import { nest as d3_nest } from 'd3-collection';

export default function(nodes) {
  const columns = d3_nest()
  .key(el => {
    return el.columnPosition;
  })
  .sortKeys((a, b) => {
    return (parseInt(a) < parseInt(b)) ? -1 : 1;
  })
  .entries(nodes);

  columns.forEach(column => {
    column.columnId = parseInt(column.key);
  });

  return columns;

}
