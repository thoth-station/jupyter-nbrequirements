/* eslint-disable */

const common = require( './webpack.config.js' )
const merge = require( 'webpack-merge' )

const __library__ = 'nbrequirements'
const __package__ = 'jupyter_nbrequirements'

const VueLoaderPlugin = require( 'vue-loader/lib/plugin' )

module.exports = merge.multiple( [
	{// UI Assets
		mode: 'development',
	},
	{// Notebook extension loader
		mode: 'development',
	},
	{// Notebook extension bundle
		mode: 'development',
		devtool: 'source-map',
	}
] )