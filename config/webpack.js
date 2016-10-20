/* eslint-env node */
var fs = require('fs');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var autoprefixer = require('autoprefixer');
var _ = require('lodash');
require('dotenv').config({silent: true});


// base object that will be used to generate individual html pages (with HtmlWebpackPlugin instances)
// as well as webpack entry points
const pages = {
  index: {
    title: 'TRASE index'
  },
  flows: {
    title: 'TRASE flows'
  },
  factsheets: {
    title: 'TRASE factsheets'
  },
  FAQ: {
    title: 'TRASE FAQ'
  },
  contact: {
    title: 'TRASE conctact'
  }
};

const htmlHeadTemplate = _.template(fs.readFileSync('./html/includes/_head.ejs', 'utf8'));
const htmlNavTemplate = _.template(fs.readFileSync('./html/includes/_nav.ejs', 'utf8'));
const htmlFooterTemplate = _.template(fs.readFileSync('./html/includes/_footer.ejs', 'utf8'));

const htmlScriptsTemplate = _.template(fs.readFileSync('./html/includes/_scripts.ejs', 'utf8'));
const getPagePlugin = (id, title) => new HtmlWebpackPlugin({
  inject: false,
  head: htmlHeadTemplate({
    title,
    dev: process.env.NODE_ENV === 'development'
  }),
  nav: htmlNavTemplate({page: id}),
  footer: htmlFooterTemplate(),
  scripts: htmlScriptsTemplate({bundle: id}),
  icons: fs.readFileSync('./html/statics/icons.svg', 'utf8'),
  filename: id+'.html',
  template: './html/'+id+'.ejs',
});

const pagePlugins = Object.keys(pages).map(id => getPagePlugin(id, pages[id].title));
const entry = _.mapValues(pages, (page, id) => './scripts/pages/' + id + '.page.js' );
module.exports = {
  entry: entry,
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new webpack.DefinePlugin({
      NODE_ENV_DEV: process.env.NODE_ENV === 'development',
      API_URL: JSON.stringify(process.env.API_URL)
    })
  ].concat(pagePlugins),
  output: {
    path: './dist',
    filename: '[name].bundle.js'
  },
  // this section allows imports with absolute paths (as if using node_modules)
  resolve: {
    root: process.cwd(),
    alias: {
      actions: 'scripts/actions',
      reducers: 'scripts/reducers',
      templates: 'scripts/templates',
      style: 'styles',
      components: 'scripts/components',
      containers: 'scripts/containers',
      statics: 'scripts/statics',
      utils: 'scripts/utils',
      constants: 'scripts/constants',
      connect: 'scripts/base/connect',
      Container: 'scripts/base/Container'
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader', 'eslint-loader'],
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass'] },
      {
        test: /\.png$/,
        loader: 'url-loader',
        query: { mimetype: 'image/png' }
      }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  }
};
