import { select as d3_select } from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import {
  scaleLinear as d3_scale_linear,
  scaleTime as d3_scale_time
} from 'd3-scale';
import {
  extent as d3_extent,
  max as d3_max
} from 'd3-array';
import {
  line as d3_line,
  area as d3_area
} from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat } from 'd3-time-format';

import 'styles/components/factsheets/line.scss';


export default class {
  constructor(className, trajectory_deforestation) {
    const elem = document.querySelector(className);
    const margin = {top: 30, right: 40, bottom: 30, left: 94};
    const width = elem.clientWidth - margin.left - margin.right;
    const height = 425 - margin.top - margin.bottom;
    const allValues = [...trajectory_deforestation.lines[0].values
      , ...trajectory_deforestation.lines[1].values
      , ...trajectory_deforestation.lines[2].values
      , ...trajectory_deforestation.lines[3].values];

    let x = d3_scale_time()
      .range([0, width])
      .domain(d3_extent(trajectory_deforestation.includedYears, y => new Date(y, 0)));
    let y = d3_scale_linear()
      .rangeRound([height, 0])
      .domain(d3_extent([0, ...allValues]));
    let y0 = d3_scale_linear().rangeRound([height, 0]);
    let y1 = d3_scale_linear().rangeRound([height, 0]);
    let y2 = d3_scale_linear().rangeRound([height, 0]);
    let y3 = d3_scale_linear().rangeRound([height, 0]);

    const xAxis = d3_axis_bottom(x)
      .tickSize(0)
      .tickPadding(15)
      .tickFormat((value, i) => {
          let format = d3_timeFormat('%y');
          if (i === 0) {
            format = d3_timeFormat('%Y');
          }

          return format(value) ;
        });
    const yAxis = d3_axis_left(y)
      .ticks(7)
      .tickSize(-width, 0)
      .tickPadding(52)
      .tickFormat((value, i) => {
        const format = d3_format('0');

        if (i === 6) {
          return `${format(value)}${trajectory_deforestation.unit}`;
        }
        return format(value) ;
      });

    let container = d3_select(elem)
      .append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
      .append('g')
          .attr('transform',
                'translate(' + margin.left + ',' + margin.top + ')');

    y0.domain(d3_extent(trajectory_deforestation.lines[0].values));
    y1.domain(d3_extent(trajectory_deforestation.lines[1].values));
    y2.domain(d3_extent(trajectory_deforestation.lines[2].values));
    y3.domain(d3_extent(trajectory_deforestation.lines[3].values));

    const dataDeforestation = prepareData(trajectory_deforestation.includedYears, trajectory_deforestation.lines[0]);
    const dataPotentialDeforestation = prepareData(trajectory_deforestation.includedYears, trajectory_deforestation.lines[1]);
    const dataTerritorialDeforestation = prepareData(trajectory_deforestation.includedYears, trajectory_deforestation.lines[2]);
    const dataStateAverage = prepareData(trajectory_deforestation.includedYears, trajectory_deforestation.lines[3]);

    const area0 = d3_area()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y0(d.value)),

      line0 = d3_line()
        .x(d => x(d.date))
        .y(d => y0(d.value)),

      line1 = d3_line()
        .x(d => x(d.date))
        .y(d => y1(d.value)),

      area2 = d3_area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y2(d.value)),

      line2 = d3_line()
        .x(d => x(d.date))
        .y(d => y2(d.value)),

      line3 = d3_line()
        .x(d => x(d.date))
        .y(d => y3(d.value));

    container.append('path')
      .datum(dataDeforestation)
      .attr('class', 'area-pink')
      .attr('d', area0);

    container.append('path')
      .datum(dataDeforestation)
      .attr('class', 'line-pink')
      .attr('d', line0);

    container.append('path')
      .datum(dataPotentialDeforestation)
      .attr('class', 'line-dashed-pink')
      .attr('d', line1);

    container.append('path')
      .datum(dataTerritorialDeforestation)
      .attr('class', 'area-black')
      .attr('d', area2);

    container.append('path')
      .datum(dataTerritorialDeforestation)
      .attr('class', 'line-black')
      .attr('d', line2);

    container.append('path')
      .datum(dataStateAverage)
      .attr('class', 'line-dashed-black')
      .attr('d', line3);

    container.append('g')
      .attr('transform', `translate(0, ${height} )`)
      .attr('class', 'axis axis--x')
      .call(xAxis);

    container.append('g')
      .attr('class', 'axis axis--y axis--deforestation')
      .call(yAxis);
  }
}

const prepareData = (includedYears, data) => {
  return includedYears.map((year, index) => {
    return {
      date: new Date(year, 0),
      value: data.values[index]
    };
  });
};
