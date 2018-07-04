/* eslint-disable */
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');

var commonResolve = {
    modulesDirectories: ['shared', 'node_modules'],
    extensions: ['', '.web.js', '.jsx', '.js', '.json'],
};

var commonLoaders = [
    {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
            cacheDirectory: true,
            presets: ['react', 'es2015', 'stage-0'],
            plugins: [
                'transform-decorators-legacy',
                'transform-react-constant-elements',
                'transform-react-inline-elements',
                ["import", [{ "style": "css", "libraryName": "antd" }]],
                'lodash',
            ]
        }
    },
    {
        test: /\.json$/,
        loader: 'json',
    },
    {
        test: /\.(png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url',
    },
    {
        test: /\.(woff|woff2|ttf|eot|svg)$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
    }
];

module.exports = [
    {
        name: 'mdoc-form',
        entry: {
            'mdoc-form': ['./App/index.js'],
        },
        output: {
            path: './build',
            filename: '[name].js',
            libraryTarget: 'window',
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
        },
        resolve: commonResolve,
        plugins: [
            new webpack.NoErrorsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin('[name].css', {allChunks: true}),
        ],
        module: {
            loaders: commonLoaders.concat(
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less', {
                        publicPath: '../css/',
                    }),
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css!postcss', {
                        publicPath: '../css/',
                    }),
                }
            )
        },
        postcss: function () {
            return [autoprefixer];
        },
    }
];
