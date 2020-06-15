const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpackMerge = require('webpack-merge');

const myFirstWebpackPlugin = require('./build-utils/MyFirstWebpackPlugin');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require('./build-utils/loadPresets');

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  return webpackMerge(
    {
      // config mode in webpack.config.js, rather than in package.json
      mode,
      // custom loader
      resolveLoader: {
        alias: {
          'my-loader': require.resolve('./build-utils/my-loader.js')
        }
      },
      module: {
        rules: [
          { test: /\.js/, use: 'my-loader' },
          {
            test: /\.jpe?g$/,
            use: [{
              loader: 'url-loader', 
              options: {
                // limit file siez to 100 bytes
                limit: 100
              }
          }]
          }
        ]
      },
      output: {
        filename: 'bundle.js',
        chunkFilename: '[name].lazy-chunk.js'
      },
      plugins: [
        new htmlWebpackPlugin(),
        new webpack.ProgressPlugin(),
        new myFirstWebpackPlugin()
      ]
    }, 
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};