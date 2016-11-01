import { select as d3_select } from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left,
  axisRight as d3_axis_right
} from 'd3-axis';
import {
    scaleLinear as d3_scale_linear,
    scaleTime as d3_scale_time
  } from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import { line as d3_line } from 'd3-shape';

import 'styles/components/factsheets/line.scss';


export default class {
  constructor(className, trajectory_deforestation, trajectory_production) {
    const margin = {top: 30, right: 40, bottom: 30, left: 50};
    const width = 600 - margin.left - margin.right;
    const height = 270 - margin.top - margin.bottom;

    var x = d3_scale_time().range([0, width]);

    var y0 = d3_scale_linear().rangeRound([height, 0]);
    var y1 = d3_scale_linear().rangeRound([height, 0]);

    var container = d3_select(className)
      .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
      .append('g')
          .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

    const extentProduction = d3_extent(trajectory_production.includedYears, y => new Date(y, 0));
    const extentDeforestation = d3_extent(trajectory_deforestation.includedYears, y => new Date(y, 0));


    if (extentProduction[1] - extentProduction[0] > extentDeforestation[1] - extentDeforestation[0]) {
      x.domain(extentProduction);
    } else {
      x.domain(extentDeforestation);
    }

    y0.domain(d3_extent(trajectory_deforestation.lines[0].values));
    y1.domain(d3_extent(trajectory_production.lines[0].values));

    const dataDeforestation = prepareData(trajectory_deforestation);
    const dataProduction = prepareData(trajectory_production);

    const line0 = d3_line()
      .x(d => x(d.date))
      .y(d => y0(d.value));

    const line1 = d3_line()
      .x(d => x(d.date))
      .y(d => y1(d.value));

    container.append('path')
      .datum(dataDeforestation)
      .attr('class', 'line--deforestation')
      .attr('d', line0);

    container.append('path')
      .datum(dataProduction)
      .attr('class', 'line--production')
      .attr('d', line1);

    container.append('g')
      .attr('transform', `translate(0, ${height} )`)
      .attr('class', 'axis axis--x')
      .call(d3_axis_bottom(x));

    container.append('g')
      .attr('class', 'axis axis--y axis--deforestation')
      .call(d3_axis_left(y0));

    container.append('text')
      .attr('class', 'axis-title axis-title--deforestation')
      .html(trajectory_deforestation.lines[0].name);

    container.append('g')
      .attr('transform', `translate(${width}, 0)`)
      .attr('class', 'axis axis--y axis--production')
      .call(d3_axis_right(y1));

    container.append('text')
      .attr('transform', `translate(${width - 100}, 0)`)
      .attr('class', 'axis-title axis-title--production')
      .html(trajectory_production.lines[0].name);
  }
}

const prepareData = data => {
  return data.includedYears.map((year, index) => {
    return {
      date: new Date(year, 0),
      value: data.lines[0].values[index]
    };
  });
};
