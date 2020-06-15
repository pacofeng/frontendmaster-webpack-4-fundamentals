const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  devtool: 'source-map',
  output: {
    // filename: "[chunkhash].js"
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.css$/, use: [miniCssExtractPlugin.loader, 'css-loader'] }
    ]
  },
  plugins: [new miniCssExtractPlugin()]
});