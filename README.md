[link to Slider!](https://docs.google.com/presentation/d/1hFtMCMo62DgOIc-9OwgaVwPZHwv1cgMELArHcMbXlSI/edit#slide=id.g15e96ef847_0_407)


### Chapter 1: Why? 
* Problems
  * Too many scripts
    * Browser has max number of default simultaneous persistent connections per server/proxy related to HTTP 1.1
      * Chrome: 6
      * Firefox 3+: 6
      * Safari 5: 6
      * IE 10: 8
      * Opera 12: 6
    * Solution: concatenate files into one using IIFE module patterns without concern of scope collision
  * With concatenation method
    * Problems: 
      * Full rebuild everytime
      * Dead code: concat doesn’t help tie usage across files 
      * Lots of IIFE are slow
      * No dynamic loading
    * Solutions: JavaScript Modules
      * CommonJS
      * AMD
      * ESM
* Webpack: a module bundler, let you write any module format and compiles them for the browser

### Chapter 2: From scratch — core concepts
* Entry: Tell Webpack WHAT files to load for the browser; compliments the output property
  * src/index.js is the default entry for webpack 
  ```
  // webpack.config.js
  module.exports = {
      entry: './browser.main.ts',
      //...
  };
  ```
* Output: Tells Webpack WHERE and HOW to distribute bundles (compilations), works with entry
  * dist/main.js is the default output for webpack
  ```
  // webpack.config.js
  module.exports = {
      output: {
          path: './dist',
          filename: './bundle.js',
      },
  //...
  }
  ```
* Loaders + Rules: Tells Webpack HOW to interpret and translate files, transform on a per-file basis before adding to the dependency graph
  * Loaders are also JavaScript modules that takes the source file, and returns it in a modified state
  ```
  // webpack.config.js
  module: {
      rules: [
          {test: /\.ts$/, use: 'ts-loader'},
          {test: /\.js$/, use: 'babel-loader'},
          {test: /\.css$/, use: 'css-loader'}
      ],
  }
  ```
  * Properties:
    * test: a regular expression that interacts the complier which files to run the loader against
    * use: an array/string/function that returns loader objects
    * enforce: can be 'pre' or 'post', tells Webpack to run this rule before or after all other rules
    * include: an array of regular expression that instruct the compiler which folders/files to include. Will only search paths provided with the include
    * exclude: an array of regular expression that instructs the compiler which folders/files to ignore
  ```
  // webpack.config.js
  module: {
      rules: [
          {
              test: regex,
              use: (Array|String|Function)
              include: RegExp[],
              exclude: RegExp[],
              issuer: (RegExp|String)[],
              enforce: 'pre'|'post'
          },
      ],
  }
  ```
  * Chaining loaders:
    * style.less -> less-loader -> style.css -> css-loader -> *.js -> style-loader -> inlineStyleInBrowser.js
    ```
    // webpack.config.js
    rules: [
        {
            test: /\.less$/,
            use:['style','css','less']
        }
    ]
    ```
* Plugins: Adds additional functionality to Compilations (optimized bundled modules). More powerful with more access to Complier API. It does everything else you wouldd ever want to in Webpack.
  * Plugins are objects, with an apply property.
  * Allow you to hook into the entire compilation lifecycle.
  * loader vs plugin:
    * Loaders: Loaders work at the individual file level during or before the bundle is generated. 
    * Plugins: Plugins work at bundle or chunk level and usually work at the end of the bundle generation process. Plugins can also modify how the bundles themselves are created. Plugins have more powerful control than loaders.
  * Plugin example:
    * It is an ES5 class with implements an apply function.
    * The complier uses it to emit events.

    ```
    function BellOnBundlerErrorPlugin () { }

    BellOnBundlerErrorPlugin.prototype.apply = function(compiler) {
        if (typeof(process) !== 'undefined') {
            // Compiler events that are emitted and handled
            compiler.plugin('done', function(stats) {
                if (stats.hasErrors()) {
                    process.stderr.write('\x07');
                }
            });
            compiler.plugin('failed', function(err) {
                process.stderr.write('\x07');
            });
        }
    }

    module.exports = BellOnBundlerErrorPlugin;
    ```
  * How to use plugins:
    * require() plugin from node_modules into config
    * add new instance of plugin to plugins key on config object 
    * provide additional info for arguments
    * more example: https://github.com/webpack/docs/wiki/list-of-plugins
    ```
    // require() from node_modules or webpack or local file
    var BellOnBundlerErrorPlugin = require(‘bell-on-error’);
    var webpack = require(‘webpack’);

    module.exports = {
        //...
        plugins: [
            new BellOnBundlerErrorPlugin(),
            // Just a few of the built in plugins
            new webpack.optimize.CommonsChunkPlugin(‘vendors’),
            new webpack.optimize.UglifyJsPlugin()
        ]
        //...
    }
    ```

## Chapter 3: Starting out right
* scripts in package.json
  * -- pine in next arguments onto the original commands
  ```
  // package.json
  "scripts": {
      "webpack": "webpack”,
      // debug specific node file: chrome://inspect
      "debug": "node --inspect --inspect-brk ./node_modules/webpack/bin/webpack.js",
      "prod": "npm run webpack -- --mode production”,
      "dev": "npm run webpack -- --mode development”,
      // debug webpack
      "prod:debug": "npm run debug -- --mode production",
      "dev:debug": "npm run debug -- --mode development”
  }
  ```
  
  * passing variable to webpack
  ```
  // package.json
  "scripts": {
      // mode = production
      "prod": "npm run webpack -- --env.mode production”,
      // mode = development
      "dev": "npm run webpack -- --env.mode development --watch",
  }
  ```
  ```
  // webpack.config.js
  module.exports = ({ mode }) =>{
      return {
          mode,
          output: {
              filename: 'bundle.js'
          }
      }
  };
  ```
*  html-webpack-plugin: This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles. This is especially useful for webpack bundles that include a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you, supply your own template using lodash templates or use your own loader.
```
yarn add html-webpack-plugin --dev
```
```
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
    return {
        // config mode in webpack.config.js, rather than in package.json
        mode,
        output: {
            filename: 'bundle.js'
        },
        plugins: [new htmlWebpackPlugin(), new webpack.ProgressPlugin()]
    }
};
```
* webpack-dev-server: A development server that provides live reloading. This should be used for development only.
```
npm install webpack-dev-server -D
```
```
"scripts": {
    "webpack-dev-server": "webpack-dev-server",
    "dev": "npm run webpack-dev-server -- --env.mode development --watch",
}
```

* Some tips:
  * cannot use commonJS and ESM syntax in one file
  * move all export to bottom
  * set a default value to mode
  ```
  module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {...};
  ```
* webpack.merge: just like object assign, merge different isolated config
```
yarn add webpack-merge --dev
```
```
const webpackMerge = require('webpack-merge');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
    return webpackMerge(
        {
            mode,
            output: { filename: 'bundle.js' },
            plugins: [new htmlWebpackPlugin(), new webpack.ProgressPlugin()]
        },
        modeConfig(mode)
    );
};
```
* webpack-dev-middleware: add to express like other plugins, it provides hot module replacement on server side
* multipage-webpack-plugin: webpack plugin that allows for trivial configuration for multi page web applications
* Using CSS with webpack:
```
module.exports = () => ({
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    }
});
```
* Hot Module Replacement (HMR): exchanges, adds, or removes modules while an application is running, without a full reload. This can significantly speed up development in a few ways:
  * Retain application state which is lost during a full reload. 
  * Save valuable development time by only updating what's changed. 
  * Instantly update the browser when modifications are made to CSS/JS in the source code, which is almost comparable to changing styles directly in the browser's dev tools.
```
"scripts": {
    "dev": "npm run webpack-dev-server -- --env.mode development --hot"
},
```
* mini-css-extract-plugin: This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.
```
npm install --save-dev mini-css-extract-plugin
```
```
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
    output: {
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.css$/, use: [miniCssExtractPlugin.loader, 'css-loader'] }
        ]
    },
    plugins: [new miniCssExtractPlugin()]
});
```
* file-loader and url-loader
  * file-loader: The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
  * url-loader: A loader for webpack which transforms files into base64 URIs.
```
npm install --dev url-loader file-loader
```
```
module: {
    rules: [
        {
            test: /\.jpe?g/,
            use: [{
                loader: 'url-loader’,
                // limit file siez to 100 bytes
                options: {
                    limit: 100
                }
            }]
        }
    ]
},
```

* Preset: sometime you just want to try something, you can set a different reset to do it, here we set a ts reset:
```
const webpackMerge = require("webpack-merge");

const applyPresets = env => {
    const { presets } = env;
    const mergedPresets = [].concat(...[presets]);
    const mergedConfigs = mergedPresets.map(
        presetName => require(`./presets/webpack.${presetName}`)(env) // call the preset and pass env also
    );

    return webpackMerge({}, ...mergedConfigs);
};

module.exports = applyPresets;
```
```
yarn add ts-loader typescript@next --dev
```
```
module.exports = () => {
    return {
        module: {
            rules: [{
                test: /\.ts$/,
                use: ['ts-loader']
            }]
        }
    }
}
```
```
"prod:typescript": "npm run prod -- --env.presets typescript"
```
* webpack-bundle-analyzer: It will create an interactive treemap visualization of the contents of all your bundles.
  * Realize what's really inside your bundle 
  * Find out what modules make up the most of its size 
  * Find modules that got there by mistake 
  * Optimize it!
```
yarn add webpack-bundle-analyzer --dev
```
```
"prod:ananyze": "npm run prod -- --env.presets ananyze",
```
```
npm run prod:analyze
```
* compression-webpack-plugin: Prepare compressed versions of assets to serve them with Content-Encoding.
```
yarn add compression-webpack-plugin --dev
```
```
const compressionPlugin = require('compression-webpack-plugin');

module.exports = () => ({
    plugins: [new compressionPlugin()]
});
```
```
yarn prod:compress -- --env.presets analyze
```
* Source map: https://webpack.js.org/configuration/devtool/
```
// web pack.production.js
module.exports = () => ({
    devtool: 'source-map',
    ...
});
```
```
yarn prod --env.presets compress
```
* Ways to find good plugins: https://github.com/webpack-contrib


Chapter 4: Web performance with Webpack
* Top 3 web page load time:
  * Amount of JavaScript for initial download
  * Amount of CSS for initial download
  * Amount of network requests on initial download 
* Goals:
  * <= 200 KB (uncompressed) initial JavaScript
  * <= 100KB (uncompressed) initial CSS
  * http: <= 6 initial network calls
  * http/2: ,= 30 initial network calls
  * 90% code coverage (only 10% code unused)
* Code splitting: process of splitting pieces of your code into async chunks at build time
  * Two types of code splitting
    * static 
      * when to use:
        * Heavy JavaScript
          * Anything temporal
          * Routes
    ```
    // always returns a promise
    const loadFooter = () => import('./footer');

    const button = makeButton('haha, new button');
    button.addEventListener('click', (e) => {
        // async fetching footer code from a separate chunk
        loadFooter().then(footerModule => {
            document.body.appendChild(footerModule.footer);
        });
    });
    ```
    * dynamic
      * when to use:
        * AB Testing
        * Theming
        * Convenience
    ```
    const getTheme = themeName => import(`./src/themes/${themeName}`);

    // using `import()` dynamically
    if (window.feeling.stylish) {
        // loading an async bundle based on runtime conditions
        getTheme('stylish').then((module) => {
            module.applyTheme();
        })
    } else if (window.feeling.trendy) {
        // loading an async bundle based on runtime conditions
        getTheme('trendy').then((module) => {
            module.applyTheme();
        })
    }
    ```
  * Always focus on splitting before caching 
* Magic comments
  * webpackChunkName
  ```
  // This will cause our separate bundle to be named footer.bundle.js instead of just [id].bundle.js
  const loadFooter = () => import(/* webpackChunkName: 'footer' */'./footer');
  ```
  ```
  output: {
      filename: 'bundle.js',
      chunkFilename: '[name].lazy-chunk.js'
  },
  ```
  * webpackMode: build time optimization, usually for dev mode
  ```
  if (process.env.NODE_ENV === 'development') {
      const setButtonStyle = (color) => import(/* webpackMode: 'lazy-once' */`./button-styles/${color}`);
  } else {
      const setButtonStyle = (color) => import(`./button-styles/${color}`);
  }
  ```
  * pre-fetch and pre-load: https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c
    * <link rel=‘prefetch’>
      * This is a resource that is probably needed for some navigation in the future.
        * Fetch while idle.
    * <link rel=‘preload’>
      * This is a resource that is definitely needed for this navigation, but will be discovered later.
      * Fetch like normal, just earlier discovered.
    * Compare:
      * Prefetch is used to use the idle time of the browser to speed up future navigations. Using it may cost additional bandwidth when the user doesn’t do the expected future navigation.
      * Preload is used to discover resources earlier and avoid a waterfall-like fetching. It’s can bring down the page load to 2 round-trips (1. HTML, 2. all other resources). Using it doesn’t cost additional bandwidth.
    * webpackPrefetch:
    ```
    // prefetch
    import(/* webpackPrefetch: true */ "LoginModal");
    ```
    ```
    // generated prefetch for the resource 
    <link charset="utf-8" rel="prefetch" as="script" href="0.lazy-chunk.js"></link>
    ```
    * webpackPreload:
    ```
    // preload
    const getLoadash = () => import(/* webpackPreload: true */'loadash-es');
    ```
    ```
    // generated preload for the resource before it’s used
    <link charset="utf-8" rel="preload" as="script" href="0.lazy-chunk.js"></link>
    ```

### Chapter 5: Webpack plugins system
* Tapable plugin system
  * Tapable instance is a class/object that extends Tapable, which os something you can plug into.
  * Some import Tapable instances
    * Compiler: central dispatcher
    * Compilation (the dependency graph)
      * created by the Compiler
      * contains dependency graph traversal algorithm 
    * Resolver
    * Module factories
      * takes successfully resolved requests
      * collects source for that file
      * creates a module object 
    * Parser: 
      * takes a module object and turns into AST
      * find all requires and imports, and creates Dependency’s 
    * Templates: 
      * it’s data binding for your modules
      * creates the code you see in the bundles (IIFE)
* Custom plugins
  * Create plugin
  ```
  class MyFirstWebpackPlugin {
      apply(compiler) {
          compiler.hooks.done.tapAsync('MyFirstWebpackPlugin', (stats, cb) => {
              // console.log(stats.toString('verbose'));
              // debugger;
              const assetNames = [];
              for (let assetName in stats.compilation.assets) {
                  assetNames.push(assetName);
              }    
              console.log(assetNames.join('\n'));
              cb();
          });
      }
  }

  module.exports = MyFirstWebpackPlugin;
  ```
  * Plugin instance hooks
  ```
  class MyFirstWebpackPlugin {
      apply(compiler) {
          //...
          compiler.hooks.compilation.tap('MyFirstWebpackPlugin', (compilation, params) => {
              const thisCompilation = compilation;
              compilation.hooks.seal.tap('MyFirstWebpackPlugin', () => {
                  console.log(thisCompilation);
              });
          });
      }
  }

  module.exports = MyFirstWebpackPlugin;
  ```
  * Isolating plugins
  ```
  class MyFirstWebpackPlugin {
      apply(compiler) {
          //...
          compiler.hooks.compilation.tap('MyFirstWebpackPlugin', (compilation, params) => {
              new MyFirstWebpackCompilationPlugin().apply(compilation);
          });
      }
  }

  class MyFirstWebpackCompilationPlugin {
      apply(compilation) {
          compilation.hooks.seal.tap('MyFirstWebpackPlugin', () => {
              debugger;
          });
      }
  }

  module.exports = MyFirstWebpackPlugin;
  ```
* Custom loader
```
// my-loader.js
function myLoader(source) {
    debugger;
    if (this.resource === '/Users/Haipeng_F/Documents/webpack-workshop-2018/src/index.js') {
        source += '; console.log("Ilovebananas")';
    }
    return source;
}

module.exports = myLoader;
```
```
// webpack.config.js
// ...
module.exports = ({ mode, presets } = { mode: 'production', presets: [] }) => {
    return webpackMerge(
        {
            // custom loader
            resolveLoader: {
                alias: {
                    'my-loader': require.resolve('./build-utils/my-loader.js')
                }
            },
            module: {
                rules: [{ test: /\.js/, use: 'my-loader' }]
            },
        },
       // ... 
    );
};
```
