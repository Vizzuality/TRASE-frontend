import { select as d3_select } from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import {
  scaleLinear as d3_scale_linear,
  scaleTime as d3_scale_time
} from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import {
  line as d3_line,
  area as d3_area
} from 'd3-shape';
import { format as d3_format } from 'd3-format';
import { timeFormat as d3_timeFormat } from 'd3-time-format';
import stringToHTML from 'utils/stringToHTML';
import LegendItemTemplate from 'ejs!templates/profiles/legendItem.ejs';

import 'styles/components/profiles/line.scss';


export default class {
  constructor(className, data) {
    const elem = document.querySelector(className);
    const legend = document.querySelector(`${className}-legend`);
    const margin = {top: 30, right: 40, bottom: 30, left: 94};
    const width = elem.clientWidth - margin.left - margin.right;
    const height = 425 - margin.top - margin.bottom;
    let allValues = [];

    let container = d3_select(elem)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    let x = d3_scale_time()
      .range([0, width])
      .domain(d3_extent(data.includedYears, y => new Date(y, 0)));

    data.lines.forEach((lineData) => {
      allValues = [...allValues, ...lineData.values];
      const y0 = d3_scale_linear()
        .rangeRound([height, 0])
        .domain(d3_extent(lineData.values));
      const lineValuesWithFormat = prepareData(data.includedYears, lineData);
      let area = null,
        line = null;

      switch (lineData.type) {
        case 'area':
          area = d3_area()
            .x(d => x(d.date))
            .y0(height)
            .y1(d => y0(d.value));

          line = d3_line()
            .x(d => x(d.date))
            .y(d => y0(d.value));

          container.append('path')
            .datum(lineValuesWithFormat)
            .attr('class', lineData.style)
            .attr('d', area);

          container.append('path')
            .datum(lineValuesWithFormat)
            .attr('class', `line-${lineData.style}`)
            .attr('d', line);
          break;
        case 'line':
          line = d3_line()
            .x(d => x(d.date))
            .y(d => y0(d.value));

          container.append('path')
            .datum(lineValuesWithFormat)
            .attr('class', lineData.style)
            .attr('d', line);
          break;
      }

      const legendItemHTML = stringToHTML(LegendItemTemplate({
        name: lineData.legend_name,
        style: lineData.style
      }));

      legend.appendChild(legendItemHTML[0]);
    });

    let y = d3_scale_linear()
      .rangeRound([height, 0])
      .domain(d3_extent([0, ...allValues]));

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
          return `${format(value)}${data.unit}`;
        }
        return format(value) ;
      });

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
