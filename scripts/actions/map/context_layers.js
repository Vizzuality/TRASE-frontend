// this file is generated by gis/getContextMaps.sh
export default [{
  name: 'landcover',
  human_name: 'Land cover',
  forceZoom: undefined,
  rasterURL: 'https://s3-eu-west-1.amazonaws.com/lulc/landcover_brazil_2015/',
  legend: '<div class="cartodb-legend custom"><ul class="bullets"><li><div class="bullet" style="background:#008156"></div>Forest</li><li><div class="bullet" style="background:#556B2F"></div>Forest plantations</li><li><div class="bullet" style="background:#E1E196"></div>Pastures</li><li><div class="bullet" style="background:#E1A500"></div>Agriculture</li><li><div class="bullet" style="background:#00FFFF"></div>Coastal forest</li><li><div class="bullet" style="background:#00AFFF"></div>Water</li><li><div class="bullet" style="background:#F5F5F3"></div>Other vegetation</li><li><div class="bullet" style="background:#3E3F40"></div>Not observed</li></ul></div>',
  layergroupid: undefined
}, {
  name: 'water_scarcity',
  human_name: 'Water scarcity',
  forceZoom: undefined,
  rasterURL: undefined,
  legend: '<div class="cartodb-legend choropleth"><ul class="bullets"><li><div class="bullet" style="background:#4575b4"><span>LESS</span></div><div class="bullet" style="background:#91bfdb"></div><div class="bullet" style="background:#e0f3f8"></div><div class="bullet" style="background:#ffffbf"></div><div class="bullet" style="background:#fee090"></div><div class="bullet" style="background:#fc8d59"></div><div class="bullet" style="background:#d73027"><span>MORE</span></div>Water scarcity</li></ul></div>',
  layergroupid: 'p2cs-sei@a3fad343@2d97c2633c3ba5dcd2df36dccdd4302c:1476796237575'
}, {
  name: 'indigenous_areas',
  human_name: 'Indigenous areas',
  forceZoom: undefined,
  rasterURL: undefined,
  legend: '<div class=\'cartodb-legend custom\'> <ul class="bullets"><li class="bkg"><div class="bullet" style="background-color:#ECC35F"></div>Indigenous areas</li></ul></div>',
  layergroupid: 'p2cs-sei@c1ddaed4@26c5bab9f58f8a7cf2ac60e166255820:1448500494201'
}, {
  name: 'brazil_protected',
  human_name: 'Brazil protected areas',
  forceZoom: undefined,
  rasterURL: undefined,
  legend: '<div class=\'cartodb-legend custom\'> <ul class="bullets"><li class="bkg"><div class="bullet" style="background-color:#B4D84F"></div>Protected areas</li></ul></div>',
  layergroupid: 'p2cs-sei@a4ef9d04@d20c83739a16ede69cfee2f0da917c12:1476798795723'
}, {
  name: 'silos',
  human_name: 'Silos',
  forceZoom: 6,
  rasterURL: undefined,
  legend: '<div class="cartodb-legend choropleth"><ul class="bullets"><li><div class="bullet" style="background:#5CA2D1"><span>0</span></div><div class="bullet" style="background:#3E7BB6"></div><div class="bullet" style="background:#2167AB"></div><div class="bullet" style="background:#0F3B82"></div><div class="bullet" style="background:#081B47"><span>> 30 TONS</span></div>Silos</li></ul></div>',
  layergroupid: 'p2cs-sei@909147cf@9c20e01d34445cd0e3d124eb13185b18:1476875895402'
}, {
  name: 'brazil_defor_alerts',
  human_name: 'Deforestation polygons',
  forceZoom: undefined,
  rasterURL: undefined,
  legend: '<div class=\'cartodb-legend custom\'><ul class="bullets"><li><div class= "bullet" style= "background:#850200"></div>Deforestation</li></ul></div>',    layergroupid: 'p2cs-sei@8c78281c@72343a666fd15a7c28aaeb268ca925fc:1478767711174'
}];