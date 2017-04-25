import { select as d3_select } from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import { scaleLinear as d3_scale_linear } from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import 'd3-transition';

import ScatterplotSwitcherTemplate from 'ejs!templates/profiles/scatterplot/scatterplot-switcher.ejs';
import 'styles/components/profiles/scatterplot.scss';
import stringToHTML from 'utils/stringToHTML';

export default class {
  constructor(className, data, xDimension) {
    this.el = document.querySelector(className);
    this.data = data;
    this.xDimension = xDimension;

    this._render();
    this._renderXswitcher();
  }

  _render() {
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = this.el.clientWidth - margin.left - margin.right,
      height = 344 - margin.top - margin.bottom;
    let allYValues = this.data.map(item => item.y);
    let allXValues = this.data.map(item => Math.max(...item.x));

    this.x = d3_scale_linear()
      .range([0, width])
      .domain(d3_extent([0, ...allXValues]));

    this.y = d3_scale_linear()
      .range([height, 0])
      .domain(d3_extent([0, ...allYValues]));

    const xAxis = d3_axis_bottom(this.x)
      .ticks(8);

    const yAxis = d3_axis_left(this.y)
      .ticks(8)
      .tickSize(-width, 0)
      .tickPadding(0);

    this.svg = d3_select(this.el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    this.svg.selectAll('circle')
      .data(this._getFormatedData(0))
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3.5)
      .attr('cx', function(d) { return this.x(d.x); }.bind(this))
      .attr('cy', function(d) { return this.y(d.y); }.bind(this));
  }

  _renderXswitcher() {
    const template = stringToHTML(ScatterplotSwitcherTemplate({data: this.xDimension}));
    this.el.appendChild(template[0]);

    this.switchers = Array.prototype.slice.call(this.el.querySelectorAll('.js-scatterplot-switcher'), 0);
    this.switchers.forEach(switcher => {
      switcher.addEventListener('click', (e) => this._switchTab(e));
    });
  }

  _switchTab(e) {
    const selectedSwitch = e && e.currentTarget;
    if (!selectedSwitch) {
      return;
    }

    const selectedTabKey = selectedSwitch.getAttribute('data-key');
    this.switchers.forEach(switcher => {
      switcher.classList.remove('selected');
    });

    this.svg.selectAll('circle')
      .data(this._getFormatedData(selectedTabKey))
      .transition()
      .duration(500)
      .attr('cx', function(d) { return this.x(d.x); }.bind(this));

    selectedSwitch.classList.add('selected');
  }

  _getFormatedData(i) {
    return this.data.map(item => {
      return {
        y: item.y,
        x: item.x[i]
      }
    });
  }
}
