const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WorkboxPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack')
const path = require('path')

module.exports = function(env) { 
  const config = {
    target: 'web',
    devtool: 'eval', // disable source-maps
    node: false, // disable all polyfills for the nodejs standard libaray
    cache: true,
    stats: {children: false},
    entry: ['babel-polyfill', './frontend/index.js'],
    output: {
      path: path.join(__dirname, '/www'),
      publicPath: '/',
      filename: '[name]-bundle-[hash].js',
      chunkFilename: '[name]-chunk-[chunkhash].js',
    },
    resolve: {
      modules: [
        path.resolve('./'),
        path.resolve('./node_modules'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
              sass: ExtractTextPlugin.extract({
                use: 'css-loader!sass-loader?indentedSyntax',
              }),
            },
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader?cacheDirectory',
          exclude: /node_modules/,
        },
        {
          test: /\.sass$/,
          use: [{
            loader: 'style-loader', // creates style nodes from JS strings
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }, {
            loader: 'sass-loader?indentedSyntax', // compiles Sass to CSS
          }]
        },
        {
          test: /frontend(\/|\\).*\.(ttf|woff|woff2|json|jpg|png)$/i,
          loader: 'file-loader?name=[name].[ext]',
        }
      ],
    },
    plugins: [
      new ExtractTextPlugin({ filename: 'style-[hash].css', allChunks: true }),
      new HtmlWebpackPlugin({
        template: 'frontend/index-template.html',
        filename: 'index.html',
        minify: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
        },
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vue-build',
        minChunks (module, count) {
          const context = module.context
          return context && (
            context.indexOf('node_modules/vue/') >= 0 ||
            context.indexOf('node_modules/vue-router/') >= 0
          )
        },
      }),

      // splitting out the webpack runtime
      new webpack.optimize.CommonsChunkPlugin({name: 'manifest'}),

      // catch all - anything used in more than one place
      new webpack.optimize.CommonsChunkPlugin({
        async: 'used-twice',
        minChunks (module, count) {
          return count > 1
        }
      }),
      new WorkboxPlugin({
        globPatterns: ['**/*.{html,js,css,jpg,png,json,ttf,woff,woff2}'],
        swSrc: './frontend/sw.js',
        swDest: './www/sw.js',
      }),
    ]
  }

  if (env && env.production) {
    // minimize for production
    config.plugins.push(new UglifyJSPlugin({}))
    config.plugins.push(new OptimizeCssAssetsPlugin())
    config.plugins.push(new webpack.DefinePlugin({
      // bizarre workarounds
      'process.env': {NODE_ENV: '"production"'}, // set production flag
      'global': {}
    }))
  } else {
    config.plugins.push(new webpack.DefinePlugin({
      // bizarre workarounds:
      'process.env': {},
      'global': {}
    }))
  }
  if (env && env.analyze) {
    // analyze bundle
    config.plugins.push(new BundleAnalyzerPlugin({analyzerMode: 'static'}))
  }

  return config
}
