var Webpack         = require('webpack');
var path            = require('path');
var srcPath         = path.resolve(__dirname, 'src');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath       = path.resolve(__dirname, 'public', 'build');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    context: __dirname,
    devtool: 'source-map',
    entry: [
        path.resolve(nodeModulesPath,'jquery','dist','jquery.js'),
        'bootstrap-sass!./src/sass/bootstrap-sass.extract-text-plugin.config.js',
        //'bootstrap-sass!./src/sass/bootstrap-sass.config.js',
        //'bootstrap-sass-loader',
        path.resolve(srcPath, 'main.js')],
    output: {
        path: buildPath,
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', exclude: [nodeModulesPath]},
            {test: /\.hbs$/, loader: "handlebars-loader"},
            {test: path.resolve(nodeModulesPath,'jquery/dist/jquery'), loader: 'expose?jQuery'},

            // Bootstrap-Sass-Loader
            {test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery'},
            {test: /\.scss$/, loader: "style!css!sass?outputStyle=expanded"},

            {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},

            {test: /\.png$/, loader: "url-loader?limit=10000&mimetype=image/png"}
        ]
    },
    plugins: [
        //new Webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //}),
        new ExtractTextPlugin("bootstrap-and-customizations.css")
    ],
    resolve: {
        //fallback: path.resolve(__dirname, 'node_modules'),
        alias: {
            'marionette': 'backbone.marionette',
            'underscore': 'lodash-compat',
            'lodash': 'lodash-compat',
            'backbone.wreqr': path.resolve(nodeModulesPath, 'backbone.marionette', 'node_modules', 'backbone.wreqr'),
            'backbone.babysitter': path.resolve(nodeModulesPath, 'backbone.marionette', 'node_modules', 'backbone.babysitter'),
            'backbone': path.resolve(nodeModulesPath, 'backbone.marionette', 'node_modules', 'backbone'),

            // convienance
            'apps': path.resolve(srcPath, 'apps'),
            'services': path.resolve(srcPath, 'services'),
            'behaviors': path.resolve(srcPath, 'behaviors')
        }
    }
};

module.exports = config;
