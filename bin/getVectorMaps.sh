#!/usr/bin/env bash

BIN='./node_modules/.bin'

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_municipalities_1' > tmp.geo.json
${BIN}/topojson -p --simplify 0.0001 -o public/municip.topo.json -- tmp.geo.json
