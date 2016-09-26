#!/usr/bin/env bash

BIN='./node_modules/.bin'

mkdir tmp

# ${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_municipalities_1' > tmp/municip.json
${BIN}/topojson -p --simplify 0.0000001 -o public/municip.topo.hi.json -- tmp/municip.json
${BIN}/topojson -p --simplify 0.001 -o public/municip.topo.json -- tmp/municip.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_biomes' > tmp/biomes.json
${BIN}/topojson -p --simplify 0.0000001 -o public/biomes.topo.json -- tmp/biomes.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_states' > tmp/states.json
${BIN}/topojson -p --simplify 0.0000001 -o public/states.topo.json -- tmp/states.json
