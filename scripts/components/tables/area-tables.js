import d3 from 'd3';
import { select as d3_select } from 'd3-selection';

var dataset = [];
var tmpDataset = [];
var i;
var j;

for (i = 0; i < 5; i++) {
  for (j = 0, tmpDataset = []; j < 3; j++) {
    tmpDataset.push('Row:'+i+',Col:'+j);
  }
  dataset.push(tmpDataset);
}

d3_select('.js-sustaninability-top')
  .append('table')
  .style('border-collapse', 'collapse')
  .style('border', '2px black solid')

  .selectAll('tr')
  .data(dataset)
  .enter().append('tr')

  .selectAll('td')
  .data(function(d){return d;})
  .enter().append('td')
  .style('border', '1px black solid')
  .style('padding', '10px')
  // .on("mouseover", function(){d3_select(this).style("background-color", "aliceblue")})
  // .on("mouseout", function(){d3_select(this).style("background-color", "#fff1ae")})
  .text(function(d){return d;})
  .style('font-size', '12px');
