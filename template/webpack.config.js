const path = require('path')
const _ = require('lodash')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')

function pickByCondition (condition, trueValue, falseValue = false) {
  return condition ? trueValue : falseValue
}

const jsName = 'js/[name][chunkhash:8].js'
const cssName = 'css/[name][chunkhash:8].css'
const fontName = 'font/[name][hash:8].[ext]'
const imageName = 'image/[name][hash:8].[ext]'

module.exports = (env = {}) => {
  const isDev = !!env.dev

  return {
    mode: isDev ? 'development' : 'production',

    devtool: 'nosources-source-map',

    devServer: {
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      historyApiFallback: true,
      hot: false,
      host: '0.0.0.0',
      disableHostCheck: true,
      port: env.port || 3000,
      stats: 'errors-only'
    },

    entry: {
      main: path.resolve(__dirname, './src/index.tsx')
    },

    output: {
      chunkFilename: jsName,
      filename: jsName,
      path: path.resolve(__dirname, './dist'),
      pathinfo: true,
      publicPath: '/'
    },

    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
      ],
      modules: ['node_modules', path.resolve(__dirname, './src')]
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          enforce: 'pre',
          exclude: [/node_modules/],
          loader: 'tslint-loader',
          options: {
            formatter: 'stylish'
          }
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]__[hash:base64:4]'
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[local]__[hash:base64:4]'
              }
            },
            'postcss-loader',
            {
              loader: 'stylus-loader',
              options: {
                import: [
                  '~style/variables.styl'
                ]
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: [{
            loader: 'url-loader',
            options: {
              name: imageName,
              limit: 2 * 1024
            }
          }]
        },
        {
          test: /\.woff((\?|#)[?#\w\d_-]+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 100,
              minetype: 'application/font-woff',
              name: fontName
            }
          }]
        },
        {
          test: /\.woff2((\?|#)[?#\w\d_-]+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 100,
              minetype: 'application/font-woff2',
              name: fontName
            }
          }]
        },
        {
          test: /\.ttf((\?|#)[?#\w\d_-]+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 100,
              minetype: 'application/octet-stream',
              name: fontName
            }
          }]
        },
        {
          test: /\.eot((\?|#)[?#\w\d_-]+)?$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 100,
              name: fontName
            }
          }]
        }
      ]
    },

    plugins: _.compact([
      pickByCondition(isDev, new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, './pages/index.html')
      })),

      pickByCondition(!isDev, new AssetsPlugin({
        // name for the created json file.
        filename: 'assets.json',
        // path where to save the created JSON file
        path: path.resolve(__dirname, './dist'),
        // whether to format the JSON output for readability
        prettyPrint: true
      })),

      new MiniCssExtractPlugin({
        filename: cssName
      }),
    ]),

    optimization: {
      runtimeChunk: { name: 'manifest' },
      minimizer: _.compact([
        pickByCondition(!isDev, new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            output: { comments: false }
          },
          sourceMap: false
        })),
    
        pickByCondition(!isDev, new OptimizeCSSAssetsPlugin())
      ]),
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'all',
            name: 'vendor',
            enforce: true,
            reuseExistingChunk: true,
            test: /[\\/]node_modules[\\/]/,
            priority: 90
          }
        }
      }
    }
  }
}