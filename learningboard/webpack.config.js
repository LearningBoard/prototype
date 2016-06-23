'use strict';

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry : {
		common : [ 'jquery', 'bootstrap-webpack!./js/bootstrap.config.js' ],
		style : [ 'font-awesome/css/font-awesome.css', './css/style.css'] ,
		boards : './js/boards.js',
		board_edit : './js/board_edit.js',
		login : './js/login.js'
	},
	output : {
		path : './dist',
		filename : '[name].js'
	},
	module : {
		loaders : [
			{
				test : /\.js$/,
				loader : 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015']
				}
			},
			{
				test : /\.css$/,
				loader : ExtractTextPlugin.extract('style-loader', 'css-loader')
			},
			{
				test : /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|svg)$/,
				loader : 'file-loader',
				query : {
					name: '[path][name].[ext]'
				}
			},
			{
				test : /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/font-woff'
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
			},
			{
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader'
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
		    }
		]
	},
	plugins : [
		new CleanWebpackPlugin('dist'),
		new ExtractTextPlugin('style.css', {
			allChunks : true
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name : 'common',
			filename : 'common.js',
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress : {
				warnings : false,
			},
			mangle : false
		})
	]
}
