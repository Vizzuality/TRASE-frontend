import {
  select as d3_select,
  event as d3_event
} from 'd3-selection';
import {
  axisBottom as d3_axis_bottom,
  axisLeft as d3_axis_left
} from 'd3-axis';
import { scaleLinear as d3_scale_linear } from 'd3-scale';
import { extent as d3_extent } from 'd3-array';
import 'd3-transition';

import ScatterplotSwitcherTemplate from 'ejs!templates/profiles/scatterplot/scatterplot-switcher.ejs';
import 'styles/components/profiles/scatterplot.scss';
import abbreviateNumber from 'utils/abbreviateNumber';

export default class {
  constructor(className, settings) {
    this.el = document.querySelector(className);
    this.switcherEl = document.querySelector('.js-scatterplot-switcher');
    this.data = settings.data;
    this.xDimension = settings.xDimension;
    this.nodeId = settings.nodeId;
    this.showTooltipCallback = settings.showTooltipCallback;
    this.hideTooltipCallback = settings.hideTooltipCallback;

    this._render();
    this._renderXswitcher();
  }

  _render() {
    const margin = {top: 4, right: 13, bottom: 30, left: 29};
    this.width = this.el.clientWidth - margin.left - margin.right;
    this.height = 377 - margin.top - margin.bottom;
    let allYValues = this.data.map(item => item.y);
    let allXValues = this.data.map(item => item.x[0]);

    this.x = d3_scale_linear()
      .range([0, this.width])
      .domain(d3_extent([0, ...allXValues]));

    this.y = d3_scale_linear()
      .range([this.height, 0])
      .domain(d3_extent([0, ...allYValues]));

    const xAxis = d3_axis_bottom(this.x)
      .ticks(8)
      .tickSize(-this.height, 0)
      .tickPadding(9)
      .tickFormat((value, i) => {
        if (i === 0) {
          return null;
        }

        return abbreviateNumber(value, 3);
      });

    const yAxis = d3_axis_left(this.y)
      .ticks(7)
      .tickSize(-this.width, 0)
      .tickPadding(9)
      .tickFormat((value) => {
        return abbreviateNumber(value, 3);
      });

    this.svg = d3_select(this.el)
      .append('svg')
      .attr('width', this.width + margin.left + margin.right)
      .attr('height', this.height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis-line')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3_axis_bottom(this.x).ticks(0).tickSizeOuter(0));

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    this.svg.append('g')
      .attr('class', 'axis axis-line')
      .call(d3_axis_left(this.y).ticks(0).tickSizeOuter(0));

    this.circles = this.svg.selectAll('circle')
      .data(this._getFormatedData(0))
      .enter()
      .append('circle')
      .attr('class', function(d) { return d.nodeId.toString() === this.nodeId ? 'dot current' : 'dot' }.bind(this))
      .attr('r', 5)
      .attr('cx', function(d) { return this.x(d.x); }.bind(this))
      .attr('cy', function(d) { return this.y(d.y); }.bind(this));

    if (this.showTooltipCallback !== undefined) {
      this.circles.on('mousemove', function(d) {
        const selectedSwitcher = document.querySelector('.js-scatterplot-switcher-item.selected span');

        this.showTooltipCallback(
          d,
          {
            name: selectedSwitcher.innerHTML,
            unit: selectedSwitcher.getAttribute('data-unit'),
          },
          d3_event.clientX + 10,
          d3_event.clientY + window.scrollY + 10
        );
      }.bind(this))
      .on('mouseout', function() {
        this.hideTooltipCallback();
      }.bind(this));
    }
  }

  _renderXswitcher() {
    this.switcherEl.innerHTML = ScatterplotSwitcherTemplate({data: this.xDimension});

    this.switchers = Array.prototype.slice.call(this.switcherEl.querySelectorAll('.js-scatterplot-switcher-item'), 0);
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
    selectedSwitch.classList.add('selected');

    const newData = this._getFormatedData(selectedTabKey);
    let allXValues = newData.map(item => item.x);
    let x = d3_scale_linear()
      .range([0, this.width])
      .domain(d3_extent([0, ...allXValues]));
    const xAxis = d3_axis_bottom(x)
      .ticks(8)
      .tickSize(-this.height, 0)
      .tickPadding(9)
      .tickFormat((value, i) => {
        if (i === 0) {
          return null;
        }

        return abbreviateNumber(value, 3);
      });

    this.circles
      .data(newData)
      .transition()
      .duration(700)
      .attr('cx', function(d) { return x(d.x); });

    this.svg.select('.axis--x')
      .transition()
      .duration(500)
      .call(xAxis);
  }

  _getFormatedData(i) {
    return this.data.map(item => {
      return {
        nodeId: item.id,
        name: item.name,
        y: item.y,
        x: item.x[i]
      }
    });
  }
}
