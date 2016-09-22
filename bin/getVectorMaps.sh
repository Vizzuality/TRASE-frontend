#!/usr/bin/env bash

BIN='./node_modules/.bin'

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_municipalities_1' > tmp.geo.json
${BIN}/topojson -p --simplify 0.00000000001 -o public/municip.topo.json -- tmp.geo.json
${BIN}/topojson -p --simplify 0.001 -o public/municip.topo.low.json -- tmp.geo.json
