#!/usr/bin/env bash

BIN='./node_modules/.bin'

mkdir tmp

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_biomes' > tmp/BIOME.json
${BIN}/topojson -p --simplify 0.0000001 -o public/BIOME.topo.json -- tmp/BIOME.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_states' > tmp/STATE.json
${BIN}/topojson -p --simplify 0.0000001 -o public/STATE.topo.json -- tmp/STATE.json

${BIN}/cartodb -u p2cs-sei -f geojson 'SELECT the_geom, geoid FROM brazil_municipalities_1' > tmp/MUNICIPALITY.json
${BIN}/topojson -p --simplify 0.0000001 -o public/MUNICIPALITY.topo.json -- tmp/MUNICIPALITY.json

ogr2ogr -f GeoJSON -t_srs crs:84 tmp/DEPARTMENT.json bin/shapefiles/paraguay-department/PARAGUAY_ADM1.shp
${BIN}/topojson -p --simplify 0.0000000001 -o public/DEPARTMENT.topo.json -- tmp/DEPARTMENT.json
