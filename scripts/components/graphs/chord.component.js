import { select as d3_select } from 'd3-selection';
import { ribbon as d3_ribbon, chord as d3_chord } from 'd3-chord';
import { descending as d3_descending } from 'd3-array';
import { arc as d3_arc } from 'd3-shape';

export default class {
  constructor(className, orgMatrix, list, placeName) {
    var matrix = [
      [ 0, 3/2, 1/2, 5/2],
      [ 3, 0, 0, 0],
      [ 1, 0, 0, 0],
      [ 5, 0, 0, 0],
    ];

    const allNames = [placeName].concat(list.map(node => node.name)).slice(0, matrix.length);

    const margin = {top: 30, right: 40, bottom: 30, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 15;

    const svg = d3_select(className)
      .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

    const chord = d3_chord()
      .padAngle(0.05)
      .sortSubgroups(d3_descending);

    const arc = d3_arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const ribbon = d3_ribbon()
      .radius(innerRadius);

    // const colors = d3_schemeCategory20();

    const container = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .datum(chord(matrix));

    const group = container.append('g')
      .attr('class', 'groups')
      .selectAll('g')
      .data(function(chords) { return chords.groups; })
      .enter().append('g');

    group.append('path')
      .style('fill', (d, i) => (i === 0) ? 'red' : 'black' /*function(d) { return color(d.index); }*/)
      // .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
      .attr('d', arc);

    container.append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data(function(chords) { return chords; })
      .enter().append('path')
      .attr('d', ribbon)
      .style('fill', 'blue')
      .style('fill-opacity', .5 /* function(d) { return color(d.target.index); }*/)
      // .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); });


    group.append('text')
    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr('dy', '.35em')
    .attr('transform', d => {
      return `rotate(${d.angle * 180 / Math.PI - 90}) translate(${innerRadius + 26}) ${d.angle > Math.PI ? 'rotate(180)' : ''}`;
    })
    .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .text((d, i) => allNames[i]);

  }
}
