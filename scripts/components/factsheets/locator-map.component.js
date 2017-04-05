import { select as d3_select } from 'd3-selection';
import { json as d3_json } from 'd3-request';
import { geoPath as d3_geoPath, /*geoAlbersUsa as d3_geoAlbersUsa,*/ geoMercator as d3_geoMercator } from 'd3-geo';
import * as topojson from 'topojson';

function getFeaturesBox(featureBounds) {
  return {
    x: featureBounds[0][0],
    y: featureBounds[0][1],
    width: featureBounds[1][0] - featureBounds[0][0],
    height: featureBounds[1][1] - featureBounds[0][1]
  };
}

// fits the geometry layer inside the viewport
function fitGeoInside(featureBounds, width, height) {
  const bbox = getFeaturesBox(featureBounds);
  const scale = 1 / Math.max(bbox.width / width, bbox.height / height);
  const trans = [-(bbox.x + bbox.width / 2) * scale + width / 2, -(bbox.y + bbox.height / 2) * scale + height / 2];

  return { scale, trans };
}


export default (className, {width, height, topoJSONPath, topoJSONRoot, isCurrent}) => {
  const svg = d3_select('.js-map-municipality').append('svg')
    .attr('width', width)
    .attr('height', height);

  const geoParent = svg.append('g');
  const container = geoParent.append('g');

  const projection = d3_geoMercator();
  const path = d3_geoPath()
    .projection(projection);

  d3_json(topoJSONPath, function(error, topoJSON) {
    const features = topojson.feature(topoJSON, topoJSON.objects[topoJSONRoot]);

    container.selectAll('path')
      .data(features.features)
      .enter()
      .append('path')
      .attr('class', d => {
        return isCurrent(d) ? 'polygon -isCurrent' : 'polygon';
      })
      .attr('d', path);

    const collection = {
      'type': 'FeatureCollection',
      'features' : features.features
    };
    const featureBounds = path.bounds(collection);
    const {scale, trans } = fitGeoInside(featureBounds, width, height);

    container.attr('transform', [
      'translate(' + trans + ')',
      'scale(' + scale + ')'
    ].join(' '));

    container.selectAll('path').style('stroke-width', 1 / scale);
  });
};
