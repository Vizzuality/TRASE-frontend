import { select as d3_select } from 'd3-selection';
import {
    scaleLinear as d3_scale_linear,
    scaleTime as d3_scale_time
  } from 'd3-scale';

import {
  area as d3_area,
  stack as d3_stack
} from 'd3-shape';

import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';

import { json as d3_json } from 'd3-request';
import { extent as d3_extent } from 'd3-array';

import _ from 'lodash';
import { STACK_AREA_COLORS } from 'constants';

export default class {

  constructor(settings) {
    this.el = settings.el;

    this.defaults = {
      margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
      }
    };

    this._setupData();
    this._build();
  }

  _setupData() {

    this.options = {
      width: this.el.clientWidth,
      height: this.el.clientHeight
    };

    _.extend(this.options, this.defaults);
  }

  _build() {
    const margins = this.options.margin;
    const width = this.options.width - margins.left - margins.right;
    const height = this.options.height - margins.top - margins.bottom;

    const svg = d3_select(this.el).append('svg')
      .attr('width', width + margins.left + margins.right)
      .attr('height', height + margins.top + margins.bottom);

    // scales
    const x = d3_scale_time().range([0, width]);
    const y = d3_scale_linear().range([height, 0]);
    const z = STACK_AREA_COLORS;


    // stack initialization
    const stack = d3_stack();

    // area initialization
    const area = d3_area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); });

    const g = svg.append('g')
        .attr('transform', `translate(${margins.left}, ${margins.top})`);


    // change this
    d3_json('factsheets/sample.json', (error, data)  => {

      if (error) throw error;
      const years = [];
      data.metadata.includedYears.forEach((year, yearIndex) => {
        var yearObject = {
          date: new Date(year, 0),
          year
        };

        data.data.forEach(municipality => {
          yearObject[municipality.name] = municipality.values[yearIndex];
        });

        years.push(yearObject);
      });

      const keys = data.data.map(municip => municip.name);

      stack.keys(keys);

      const stacked = stack(years);

      // scale domains
      x.domain(d3_extent(data.metadata.includedYears, function(y) { return new Date(y, 0); }));
      // z.domain(keys);

      // get max y value
      var maxYearValue = 0;

      data.metadata.includedYears.forEach((year, yearIndex) => {
        var yearStackedValue = 0;
        data.data.forEach(municipality => {
          yearStackedValue += municipality.values[yearIndex];
        });
        if (yearStackedValue > maxYearValue) maxYearValue = yearStackedValue;
      });

      y.domain([0, maxYearValue]);

      const layer = g.selectAll('.layer')
        .data(stacked)
        .enter().append('g')
          .attr('class', 'layer');

      layer.append('path')
        .attr('class', 'area')
        .style('fill', function(c, i) { return z[i]; })
        .attr('d', area);

      layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
        .append('text')
          .attr('class', 'tag')
          .attr('x', width - 6)
          .attr('y', function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
          .attr('dy', '.35em')
          .text(function(d) { return d.key; });

      // axis implementation
      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(0, ${height} )`)
        .call(d3_axis_bottom(x));

      g.append('g')
          .attr('class', 'axis axis--y')
          .call(d3_axis_left(y).ticks(5, 's'));
    });
  }
}
