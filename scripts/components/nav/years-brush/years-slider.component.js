import { select as d3_select } from 'd3-selection';
import { axisTop as d3_axis_top } from 'd3-axis';
import { scaleTime as d3_scale_time } from 'd3-scale';
import { timeYear as d3_time_timeYear } from 'd3-time';
import { brushX as d3_brush_x } from 'd3-brush';
import { event as d3_event } from 'd3-selection';
import ThumbTemplate from 'ejs!templates/years-slider-thumb.ejs';
import addSVGDropShadowDef from 'utils/addSVGDropShadowDef';
import 'styles/components/nav/years-slider.scss';



export default class {
  constructor(id, callback) {
    this.id = id;
    this.callback = callback;
    this.el = document.querySelector(`.${id}`);
  }

  setYears(years) {
    const d0 = [new Date(years[0], 0, 1), new Date(years[1] + 1, 0, 1)];
    const pixelSelection = d0.map(this.xScale);

    // disable brush end event listener to avoid infinite loop
    this.brushBehavior.on('end', null);
    // this will automatically trigger a brush event, calling _moveBrushOverlay
    this.brush.call(this.brushBehavior.move, pixelSelection);
    // re-enable brush end event after brush has been moved
    this.brushBehavior.on('end', this._onBrushEnd.bind(this));

  }

  setAvailableYears(years) {
    this._build(years);
  }

  _build (years) {

    const startYear = years[0];
    const endYear = years[years.length - 1];

    var margin = {
      top: 5,
      right: 5,
      bottom: 10,
      left: 5
    };
    const width = ((endYear - startYear + 1) * 40) - margin.left - margin.right;
    const height = 45 - margin.top - margin.bottom;
    this.xScale = d3_scale_time()
      .domain([new Date(startYear, 0, 1), new Date(endYear, 11, 31)])
      .rangeRound([0, width])
      .nice(d3_time_timeYear);

    const svg = d3_select(this.el).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    addSVGDropShadowDef(svg);

    this.slider = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);


    this.brushBehavior = d3_brush_x()
      .extent([[0, 0], [width, height]])
      .on('brush', this._onBrushMove.bind(this))
      .on('end', this._onBrushEnd.bind(this));

    this.brush = this.slider.append('g')
      .attr('class', 'brush')
      .call(this.brushBehavior);


    this._addAxis('axis', height);


    this.selectionOverlay = this.slider.append('g').attr('class', 'selection-overlay');

    this.selectionOverlayRect = this.selectionOverlay.append('rect')
      .attr('class', 'selection-overlay-rect')
      .attr('height', height)
      .style('filter', 'url(#drop-shadow)'); // defined by addSVGDropShadowDef

    this.selectionOverlayThumbLeft = this.selectionOverlay.append('g')
      .attr('transform', 'translate(-4, -4)')
      .html(ThumbTemplate());
    this.selectionOverlayThumbRight = this.selectionOverlay.append('g')
      .html(ThumbTemplate());


    this._addAxis('axis-front', height);
    this.slider.selectAll('.axis-front .tick text')
      .attr('x', 19);
  }

  _addAxis(className, height) {
    this.slider.append('g')
      .attr('class', className)
      .attr('transform', `translate(0, ${height})`)
      .call(d3_axis_top(this.xScale)
        .ticks(d3_time_timeYear)
        .tickPadding(-18)
        .tickSize(height)
      );

  }

  _onBrushMove() {
    this._moveBrushOverlay(d3_event.selection);
  }

  _onBrushEnd() {
    if (!d3_event.sourceEvent) return;
    if (!d3_event.selection) return;

    var d0 = d3_event.selection.map(this.xScale.invert),
      d1 = d0.map(d3_time_timeYear.round);

    if (d1[0] >= d1[1]) {
      d1[0] = d3_time_timeYear.floor(d0[0]);
      d1[1] = d3_time_timeYear.offset(d0[1]);
    }

    const pixelSelection = d1.map(this.xScale);

    this._moveBrushOverlay(pixelSelection);

    this.brush.transition()
      .call(d3_event.target.move, pixelSelection);

    var startYear = new Date (d1[0]).getFullYear();
    var endYear = new Date (d1[1]).getFullYear() - 1;

    this.callback([startYear, endYear]);
  }

  _moveBrushOverlay(pixelSelection) {
    const x = pixelSelection[0];
    const width = pixelSelection[1] - x;
    this.selectionOverlay.attr('transform', `translate(${x}, 0)`);
    this.selectionOverlayRect.attr('width', width);
    this.selectionOverlayThumbRight.attr('transform', `translate(${width-4}, -4)`);

    return pixelSelection;
  }

}
