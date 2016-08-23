# TRASE-frontend

Original prototype:
https://ttp.sei-international.org/

This project mainly uses D3 and Leaflet, plus Redux for managing app state. More on the stack:
https://github.com/Vizzuality/TRASE-frontend/issues/9

## Run locally

### backend
- Import Postgre database from this dump: https://github.com/sei-international/TRASE/tree/master/DB
- Clone [the backend](https://github.com/sei-international/TRASE) and run the API server:
```
python API/server.py
```

### frontend
- Checkout develop branch
- install dependencies:
```
npm i
```
- and run:
```
npm run dev
```
- [http://localhost:8081/](http://localhost:8081/)


## LICENSE

[MIT](LICENSE)
