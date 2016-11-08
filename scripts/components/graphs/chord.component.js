import { select as d3_select } from 'd3-selection';
import { ribbon as d3_ribbon, chord as d3_chord } from 'd3-chord';
import { descending as d3_descending } from 'd3-array';
import { arc as d3_arc } from 'd3-shape';

import { CHORD_COLORS } from 'constants';

import 'styles/components/factsheets/chord.scss';

export default class {
  constructor(className, orgMatrix, list, placeName) {
    const allNames = [placeName].concat(list.map(node => node.name)).slice(0, orgMatrix.length);

    const margin = {top: 40, right: 40, bottom: 0, left: 40};
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

    const xTranslate = (width / 2) + margin.left;
    const yTranslate = (height / 2) + margin.top;

    const container = svg.append('g')
      .attr('transform', `translate(${xTranslate}, ${yTranslate})`)
      .datum(chord(orgMatrix));

    const group = container.append('g')
      .attr('class', 'groups')
      .selectAll('g')
      .data((chords) => chords.groups)
      .enter().append('g');

    group.append('path')
      .attr('class', 'border')
      .attr('d', arc)
      .style('fill', (d, i) => (i === 0) ? CHORD_COLORS[0] : CHORD_COLORS[1] );


    container.append('g')
      .attr('class', 'ribbons')
      .selectAll('path')
      .data((chords) => chords)
      .enter().append('path')
        .attr('d', ribbon)
        .attr('class', 'links');


    group.append('text')
    .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr('dy', '.35em')
    .attr('class', 'text-legend')
    .attr('transform', d => {
      return `rotate(${d.angle * 180 / Math.PI - 90}) translate(${innerRadius + 24}) ${d.angle > Math.PI ? 'rotate(180)' : ''}`;
    })
    .style('text-anchor', d => d.angle > Math.PI ? 'end' : null)
    .text((d, i) => allNames[i]);
  }
}
