function myLoader(source) {
  debugger;
  if (this.resource === '/Users/Haipeng_F/Documents/webpack-workshop-2018/src/index.js') {
    source += '; console.log("Ilovebananas")';
  }
  return source;
}

module.exports = myLoader;