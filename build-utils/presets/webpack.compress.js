const compressionPlugin = require('compression-webpack-plugin');

module.exports = () => ({
    plugins: [new compressionPlugin()]
});