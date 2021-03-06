# ⚠️ This repo is not in active use anymore. TRASE Frontend code has been merged with the <a href="https://github.com/Vizzuality/trase-api">API repo</a> ⚠️

# TRASE

![TRASE](trase-screenshot.png)

Source code for the [TRASE](https://trase.earth) front end.

## About TRASE

Trase brings unprecedented transparency to commodity supply chains revealing new pathways towards achieving a
deforestation-free economy.

## About this project

This project consists of only the frontend application for the TRASE website.
All data displayed is loaded through requests to the TRASE API.

This project mainly uses D3 and Leaflet, plus Redux for managing app state.
More on the stack [here](https://github.com/Vizzuality/TRASE-frontend/issues/9)

Besides the frontend code, the project also includes a standalone nodejs web server, which should be used only for
development purposes


## Lexicon

```
+-------+             +-------+
|       |             |       |
|       |             |       |
+-------+ ---\        |       |
| node  |     \-------+-------+
+-------+--\  link    | node  |
|       |   \         |       |
|       |    \--------+-------+
|       |             |       |   
+-------+             +-------+
  column                column

```

## Configuration

The project's main configuration values can be set using [environment variables](https://en.wikipedia.org/wiki/Environment_variable)

* PORT: port used by the development web server. defaults to 8081
* NODE_ENV: environment used by the nodejs tasks
* AUTH_USER + AUTH_PASSWORD: if set, an auth wall is used by the nodejs development web server
* API_V1_URL: URL of the data API V1
* API_V2_URL: URL of the data API V2
* API_CMS_URL: URL of the homepage stories API
* API_STORY_CONTENT: URL of the deep dive stories API
* API_SOCIAL: URL of the tweets API
* GOOGLE_ANALYTICS_KEY: API key for Google Analytics
* DATA_FORM_ENABLED: enable contact form in Data page
* DATA_FORM_ENDPOINT: end point to send form values in Data page

If you are using the included development server, you can set those variables in the `.env` file (use the included `.env.sample` as an example)

## Development set up

- Check out the code from [github](github.com/Vizzuality/TRASE-frontend)
- Install dependencies:
```
npm i
```
- Start the development server:
```
npm run dev
```
- [http://localhost:8081/](http://localhost:8081/)


#### generate vector map layers

Vector layers are generated with one of the two workflows:
- CARTO (remote DB) -> geoJSON -> topoJSON
- local shapefiles -> geoJSON -> topoJSON

All can be generated by running:
```
./gis/getVectorMaps.sh
```

All dependencies should be installed by npm install, except ogr2ogr (used for shapefile conversion), which you have to install globally with GDAL.

Generate municipalities by state TopoJSON files (only for Brazil for now) by running:
```
./gis/vector_maps/get_brazil_municip_states.js
```


#### generate CARTO named maps (context layers)

- Copy CARTO credentials:
```
cp cp ./gis/cartodb/cartodb-config.sample.json ./gis/cartodb/cartodb-config.json
```
- Replace api_key value in `cartodb-config.json`
- To update or instantiate context layers run
```
./gis/getContextMaps.sh
```
This will use the layers configuration stored in `./gis/cartodb/templates.json`


## Production

Run `npm run build`, it will create a production-ready version of the project in `/dist`.


## Deployment

Depending on the environment where you want to deploy, you need to have a `.env.staging` or a `.env.production` file set up.

Then run
```
npm run deploy:staging
```
or
```
npm run deploy:production
```

This will build using appropriate env file and upload to server usinc scp.

## LICENSE

[MIT](LICENSE)
