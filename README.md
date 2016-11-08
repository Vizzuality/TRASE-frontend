# TRASE-frontend

Original prototype:
https://ttp.sei-international.org/

This project mainly uses D3 and Leaflet, plus Redux for managing app state. More on the stack:
https://github.com/Vizzuality/TRASE-frontend/issues/9

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

## Run locally

### backend
- Import Postgre database from this dump: https://github.com/sei-international/TRASE/tree/master/DB
- Clone [the backend](https://github.com/sei-international/TRASE) and run the API server:
```
python API/server.py
```

### frontend
- Checkout develop branch
- copy default env parameters
```
cp .env.sample.json .env
```
- install dependencies:
```
npm i
```
- and run:
```
npm run dev
```
- [http://localhost:8081/](http://localhost:8081/)

### generate CARTO named maps

- copy CARTO credentials:
```
cp cp ./bin/cartodb/cartodb-config.sample.json ./bin/cartodb/cartodb-config.json
```
- in cartodb-config.sample.json, replace api_key value
- to update or instanciate context layers run
```
./bin/getContextMaps.sh
```
This will use the layers configuration stored in `./bin/cartodb/templates.json` 


## Deploy

Run `npm run build`, it will create a production-ready version of the project in /dist.


## LICENSE

[MIT](LICENSE)
