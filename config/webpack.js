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
    title: 'TRASE'
  },
  flows: {
    title: 'TRASE flows'
  },
  factsheets: {
    title: 'TRASE - Factsheets'
  },
  'factsheet-actor': {
    title: 'TRASE - Factsheet'
  },
  'factsheet-place': {
    title: 'TRASE - Factsheet'
  },
  FAQ: {
    title: 'TRASE - FAQ'
  },
  about: {
    title: 'TRASE - About'
  },
  'terms-of-use': {
    title: 'TRASE - Terms of use'
  },
  'data-methods': {
    title: 'TRASE - Data and methods'
  }
};

const htmlHeadTemplate = _.template(fs.readFileSync('./html/includes/_head.ejs', 'utf8'));
const htmlSearchTemplate = _.template(fs.readFileSync('./html/includes/_search.ejs', 'utf8'));
const htmlNavTemplate = _.template(fs.readFileSync('./html/includes/_nav.ejs', 'utf8'));
const htmlFooterTemplate = _.template(fs.readFileSync('./html/includes/_footer.ejs', 'utf8'));

const htmlScriptsTemplate = _.template(fs.readFileSync('./html/includes/_scripts.ejs', 'utf8'));
const getPagePlugin = (id, params) => {
  const title = params.title || 'TRASE';
  const description = params.description || 'Trase brings unprecedented transparency to commodity supply chains revealing new pathways towards achieving a deforestation-free economy.';
  return new HtmlWebpackPlugin({
    inject: false,
    head: htmlHeadTemplate({
      title,
      description,
      dev: process.env.NODE_ENV === 'development',
      GOOGLE_ANALYTICS_KEY: JSON.stringify(process.env.GOOGLE_ANALYTICS_KEY),
    }),
    search: htmlSearchTemplate(),
    nav: htmlNavTemplate({page: id}),
    footer: htmlFooterTemplate(),
    scripts: htmlScriptsTemplate({bundle: id}),
    icons: fs.readFileSync('./html/statics/icons.svg', 'utf8'),
    filename: id+'.html',
    template: './html/'+id+'.ejs',
  });
};

const pagePlugins = Object.keys(pages).map(id => getPagePlugin(id, pages[id]));
const entry = _.mapValues(pages, (page, id) => './scripts/pages/' + id + '.page.js' );

const config = {
  entry: entry,
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new webpack.DefinePlugin({
      NODE_ENV_DEV: process.env.NODE_ENV === 'development',
      API_V1_URL: JSON.stringify(process.env.API_V1_URL),
      API_V2_URL: JSON.stringify(process.env.API_V2_URL),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      API_CMS_URL: JSON.stringify(process.env.API_CMS_URL),
      API_STORY_CONTENT: JSON.stringify(process.env.API_STORY_CONTENT)
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

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true
      }
    })
  );
}

module.exports = config;
