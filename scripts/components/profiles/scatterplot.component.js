import { select as d3_select } from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import {
  scaleLinear as d3_scale_linear
} from 'd3-scale';
import { extent as d3_extent } from 'd3-array';

import 'styles/components/profiles/scatterplot.scss';

export default class {
  constructor(className, data) {

    const elem = document.querySelector(className);
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = elem.clientWidth - margin.left - margin.right,
      height = 344 - margin.top - margin.bottom;
    let allYValues = data.companies.map(company => company.y);
    let allXValues = data.companies.map(company => Math.max(...company.x));

    let x = d3_scale_linear()
      .range([0, width])
      .domain(d3_extent([0, ...allXValues]));

    let y = d3_scale_linear()
      .range([height, 0])
      .domain(d3_extent([0, ...allYValues]));

    const xAxis = d3_axis_bottom(x);

    const yAxis = d3_axis_left(y);

    this.svg = d3_select(elem)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Sepal Width (cm)');

    this.svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Sepal Length (cm)');

    this.svg.selectAll('.dot')
      .data(data.companies).enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', function(d) { return x(d.x[0]); })
      .attr('cy', function(d) { return y(d.y); });

  }
}
