var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  verbose: false, // Set to true to show diagnostic information

  preBootstrapCustomizations: path.resolve(__dirname, '_pre-bootstrap-customizations.scss'),
  bootstrapCustomizations: path.resolve(__dirname, '_bootstrap-customizations.scss'),
  mainSass: path.resolve(__dirname, '_main.scss'),

  // Default for the style loading is to put in your js files
  // styleLoader: "style-loader!css-loader!sass-loader",
  // If you want to use the ExtractTextPlugin
  //   and you want compressed
  //     styleLoader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader"),

  // If you want expanded CSS
  styleLoader: ExtractTextPlugin.extract("style-loader", "css-loader!sass?outputStyle=expanded"),

  // ### Scripts
  // Any scripts here set to false will never
  // make it to the client, it's not packaged
  // by webpack.
  scripts: {
    'transition': false,
    'alert': true,
    'button': true,
    'carousel': false,
    'collapse': false,
    'dropdown': true,
    'modal': true,
    'tooltip': true,
    'popover': true,
    'scrollspy': false,
    'tab': true,
    'affix': false
  },
  // ### Styles
  // Enable or disable certain less components and thus remove
  // the css for them from the build.
  styles: {
    "mixins": true,

    "normalize": true,
    "print": true,
    "glyphicons": true,

    "scaffolding": true,
    "type": true,
    "code": true,
    "grid": true,
    "tables": true,
    "forms": true,
    "buttons": true,

    "component-animations": true,
    "dropdowns": true,
    "button-groups": true,
    "input-groups": true,
    "navs": true,
    "navbar": true,
    "breadcrumbs": true,
    "pagination": true,
    "pager": true,
    "labels": true,
    "badges": true,
    "jumbotron": true,
    "thumbnails": true,
    "alerts": true,
    "progress-bars": true,
    "media": true,
    "list-group": true,
    "panels": true,
    "wells": true,
    "responsive-embed": true,
    "close": true,

    "modals": true,
    "tooltip": true,
    "popovers": true,
    "carousel": true,

    "utilities": true,
    "responsive-utilities": true
  }
};
