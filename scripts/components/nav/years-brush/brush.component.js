import { select as d3_select } from 'd3-selection';
import { axisBottom as d3_axis_bottom } from 'd3-axis';
import { scaleTime as d3_scale_time } from 'd3-scale';
import { timeYear as d3_time_timeYear } from 'd3-time';
import { brushX as d3_brush_x } from 'd3-brush';
import { event as d3_event } from 'd3-selection';
// import { dispatch as d3_dispatch } from 'd3-dispatch';

import 'styles/components/nav/years-slider.scss';

export default class {
  constructor(settings) {
    this.el = document.querySelector(`.${settings.id}`);
    // this.data = settings.data;
    this.callback =  settings.callback;

    // sample settings
    this.data = [2012, 2013, 2014, 2015, 2016];
    this.defaultPosition = [new Date(2014, 1, 1), new Date(2015, 1, 1)];

    this.render();
  }

  render() {
    // var defaultPosition = this.defaultPosition;
    var callback = this.callback;
    var startYear = this.data[0],
      endYear = this.data[this.data.length - 2];
    var margin = {
        top: 18,
        right: 20,
        bottom: 18,
        left: 20
      },
      width = (this.data.length * 70) - margin.left - margin.right,
      height = 95 - margin.top - margin.bottom;


    var xScale = d3_scale_time()
      .domain([new Date(startYear, 1, 1), new Date(endYear, 1, 1)])
      .rangeRound([0, width])
      .nice(d3_time_timeYear);

    this.slider = d3_select(this.el).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.slider.append('g')
      .attr('class', 'axis axis--grid')
      .attr('transform', `translate(0, ${height})`)
      .call(d3_axis_bottom(xScale)
        .ticks(d3_time_timeYear)
        .tickSize(-height));


    var brushened = function() {

      if (!d3_event.sourceEvent) return;
      if (!d3_event.selection) return;


      var d0 = d3_event.selection.map(xScale.invert),
        d1 = d0.map(d3_time_timeYear.round);

      if (d1[0] >= d1[1]) {
        d1[0] = d3_time_timeYear.floor(d0[0]);
        d1[1] = d3_time_timeYear.offset(d0[1]);
      }

      d3_select(this).transition()
        .call(d3_event.target.move, d1.map(xScale));

      var startYear = new Date (d1[0]).getFullYear();
      var endYear= new Date (d1[1]).getFullYear();

      callback([startYear, endYear]);
    };


    // var onYearsSelected = function() {
    //   var startYear = new Date (defaultPosition[0]).getFullYear();
    //   var endYear= new Date (defaultPosition[1]).getFullYear();
    //
    //   var d1 = [startYear, endYear];
    //
    //   d3_select(this.brush).transition()
    //     .call(this.brush, d1.map(xScale));
    // };


    // Brush
    this.brush = this.slider.append('g')
      .attr('class', 'brush')
      .call(d3_brush_x()
        .extent([[0, 0], [width, height]])
        .on('end', brushened)
      );

    // this.brush.on('onYearsSelected', onYearsSelected);
    //
    //
    // if (defaultPosition) {
    //   this.brush.dispatch('onYearsSelected', onYearsSelected);
    // }
  }
}
